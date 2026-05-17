import {prisma} from '../lib/prisma';
import {Battle, BattleStatus} from "@prisma/client";
import {enqueueEventTx} from "@shared/pg-boss/src/enqueueEvent";
import {kafkaProducersConfig} from "../config/kafka.config";

export async function getBattle(battleId: string): Promise<Battle | null> {
  const battle = await prisma.battle.findUnique({
    where: {id: battleId}
  });

  return battle;
}

export async function upsertBattle(userId: string): Promise<Battle> {
  const existingMyBattle = await prisma.battle.findFirst({
    where: {
      players: { has: userId },
      status: { not: BattleStatus.Finished }
    }
  });

  if (existingMyBattle) {
    return existingMyBattle;
  }

  const existingSomebodiesBattle = await prisma.battle.findFirst({
    where: {
      playersCount: 1,
      status: { not: BattleStatus.Finished },
      NOT: {
        players: { has: userId },
      },
    }
  });

  if (existingSomebodiesBattle) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.battle.updateMany({
        where: {
          id: existingSomebodiesBattle.id,
          playersCount: 1, // гарантируем, что пока один игрок
          status: { not: BattleStatus.Finished },
        },
        data: {
          players: { push: userId },
          playersCount: { increment: 1 },
        },
      });

      if (updated.count === 0) {
        throw new Error("Battle already full or finished");
      }

      const battle = await tx.battle.findUnique({
        where: { id: existingSomebodiesBattle.id },
      });

      if (!battle) {
        throw new Error("Unknown error");
      }

      await enqueueEventTx(kafkaProducersConfig.topicBattleNew, battle as Object, tx);

      return battle;
    });
  }

  const battle = await prisma.battle.create({
    data: { players: [userId], playersCount: 1, status: BattleStatus.Active, cells: [] }
  });


  return battle;
}

export async function updateBattle(battleId: string): Promise<Battle | null> {
  const battle = await prisma.battle.findUnique({
    where: {id: battleId}
  });

  return battle;
}

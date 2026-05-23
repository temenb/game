import {prisma} from '../lib/prisma';
import {Battle, BattleStatus} from "@prisma/client";
import {enqueueEventTx} from "@shared/pg-boss/src/enqueueEvent";
import {kafkaProducersConfig} from "../config/kafka.config";
import logger from "@shared/logger";
import {BattleObject} from "../grpc/generated/battle";
import {battleToGrpc, battleToPrisma} from "../lib/battle-grpc-prisma-converters";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export async function getBattle(battleId: string): Promise<Battle | null> {
  const battle = await prisma.battle.findUnique({
    where: {id: battleId}
  });

  return battle;
}

export async function updateBattle(battleObj: BattleObject): Promise<Battle> {
  const battle = battleToPrisma(battleObj);
  const updated = await prisma.battle.update({
    where: { id: battle.id },
    data: {
      cells: battle.cells,
      status: battle.status,
      winner: battle.winner ?? null,
      lastMoveAt: new Date(),
    },
  });

  logger.log("battle updated");
  logger.log(updated);
  return updated;
}
export async function upsertBattle(userId: string): Promise<Battle> {
  // Проверяем, есть ли уже мой активный баттл
  const existingMyBattle = await prisma.battle.findFirst({
    where: {
      players: { has: userId },
      status: { not: BattleStatus.Finished },
    },
  });

  if (existingMyBattle) {
    return existingMyBattle;
  }

  // Ищем чужой баттл с одним игроком
  const existingSomebodiesBattle = await prisma.battle.findFirst({
    where: {
      playersCount: 1,
      status: { not: BattleStatus.Finished },
      NOT: { players: { has: userId } },
    },
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
        throw new NotFoundError("Unknown error");
      }

      logger.log('battle started');
      logger.log(battle);
      await enqueueEventTx(kafkaProducersConfig.topicBattleStarted, battleToGrpc(battle), tx);

      return battle;
    });
  }

  // Если ничего не нашли — создаём новый баттл
  return await prisma.battle.create({
    data: {
      players: [userId],
      playersCount: 1,
      status: BattleStatus.Active,
    },
  });
}


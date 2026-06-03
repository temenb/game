import {Battle, BattleStatus, BattleCellValue} from "@prisma/client";
import prisma from "../lib/prisma";
import {BattleObject} from "../grpc/generated/battle";
import {battleToGrpc, battleToPrisma} from "../lib/battle-grpc-prisma-converters";
import logger from "@shared/logger";
import * as BattleGrpc from "../grpc/generated/battle";
import * as EmptyGrpc from "../grpc/generated/common/empty";
import {NotFoundError} from "../services/battle.service";

export class BattleModel {
  static async findBattleByUser(profileId: string): Promise<Battle | null> {
    return prisma.battle.findFirst({
      where: {
        players: {has: profileId},
        status: BattleStatus.Active,
      },
    });
  }


  static async findAvailableBattle(profileId: string): Promise<Battle | null> {
    return prisma.battle.findFirst({
      where: {
        playersCount: 1,
        status: BattleStatus.Active,
        NOT: {players: {has: profileId}},
      },
    });
  }

  static async joinBattle(
    battleId: string
    , profileId: string
    , callback: (battle: BattleGrpc.BattleObject) => Promise<EmptyGrpc.Empty | null>
  ): Promise<Battle> {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.battle.updateMany({
        where: {
          id: battleId,
          playersCount: 1, // гарантируем, что пока один игрок
          status: {not: BattleStatus.Finished},
        },
        data: {
          players: {push: profileId},
          playersCount: {increment: 1},
        },
      });


      if (updated.count === 0) {
        throw new Error("Battle already full or finished");
      }

      const battle = await tx.battle.findUnique({
        where: {id: battleId},
      });

      if (!battle) {
        throw new NotFoundError("Unknown error");
      }

      logger.log('battle started');
      logger.log(battle);

      callback(battleToGrpc(battle));
      return battle;
    });
  }

  static async getBattle(battleId: string): Promise<Battle | null> {
    return await prisma.battle.findUnique({
      where: {id: battleId}
    });
  }

  static async createBattle(profileId: string): Promise<Battle> {


    logger.log('create battle for profile', profileId);
    return prisma.battle.create({
      data: {
        players: [profileId],
        cells: Array(9).fill(BattleCellValue.EMPTY),
        playersCount: 1,
        status: BattleStatus.Active,
      },
    });
  }

  static async updateBattle(battleObj: BattleObject): Promise<Battle> {
    const battle = battleToPrisma(battleObj);
    const updated = await prisma.battle.update({
      where: {id: battle.id},
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
}

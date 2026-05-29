import {Battle, BattleStatus} from "@prisma/client";
import {BattleModel} from "../models/battle.model";
import {BattleObject} from "../grpc/generated/battle";
import * as EngineClient from "../grpc/clients/engine.client";
import logger from "@shared/logger";

// import {enqueueEventTx} from "@shared/pg-boss/src/enqueueEvent";
// import {kafkaProducersConfig} from "../config/kafka.config";
// import {battleToGrpc} from "../lib/battle-grpc-prisma-converters";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export async function upsertBattle(userId: string): Promise<Battle> {
  const existingMyBattle = await BattleModel.findBattleByUser(userId);

  logger.log('upsert battle for user', userId);

  if (existingMyBattle) {
    return existingMyBattle;
  }

  let attempts = 3;

  while (attempts > 0) {
    const existingSomebodiesBattle = await BattleModel.findAvailableBattle(userId);

    if (existingSomebodiesBattle) {
      try {

        logger.log('join battle', existingSomebodiesBattle);
        const battleNew = async (battle: BattleObject) => await EngineClient.battleNew(battle);
        return await BattleModel.joinBattle(existingSomebodiesBattle.id, userId, battleNew);
      } catch (e) {
        // await enqueueEventTx(kafkaProducersConfig.topicBattleStarted, battleToGrpc(battle), tx);

        // export const makeMove = (move: EngineGrpc.BattleMoveRequest): Promise<EmptyGrpc.Empty | null> => {
        //   return engineManager.call((client, cb) => client.battleMove(move, cb));
        // };
      }
      attempts--;
      continue;
    }


    return BattleModel.createBattle(userId);
  }

  return BattleModel.createBattle(userId);
}


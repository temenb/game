import * as BattleClient from "../grpc/clients/battle.client";
import {getBattleStream, deleteActiveBattleStream} from "../grpc/handlers/battle.handler";
import {BattleObject, BattleStatus} from "../grpc/generated/battle";
import logger from "@shared/logger";

export const health = async () =>
  await BattleClient.health();

export const status = async () =>
  await BattleClient.status();

export const livez = async () =>
  await BattleClient.livez();

export const readyz = async () =>
  await BattleClient.readyz();

export const upsertBattle = async (userId: string) =>
  await BattleClient.upsertBattle(userId);

export const updateBattle = async (battle: BattleObject) => {
  const streams = getBattleStream(battle.id);
  if (!streams) {
    logger.log("battle object = ", battle);
    throw new Error(`No active streams found for battleId=${battle.id}`);
  }

  for (const stream of streams) {
    stream.write(battle);
  }

  if (battle.winner || battle.status != BattleStatus.ACTIVE) {
    logger.log(`Battle ${battle.id} finished. Closing streams...`);
    for (const stream of streams) {
      try {
        stream.end();
      } catch (err) {
        logger.error("Error closing stream:", err);
      }
    }
    deleteActiveBattleStream(battle.id);
    logger.log(`Removed battle ${battle.id} from activeBattleStreams`);
  }
};
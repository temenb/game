import * as BattleClient from "../grpc/clients/battle.client";
import BattleStreamRegistry from "../channels/battle.stream";
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
  logger.log('update battle: battle');
  BattleStreamRegistry.writeBattleStreams(battle);

  if (battle.winner || battle.status != BattleStatus.ACTIVE) {
    logger.log(`Battle ${battle.id} finished. Closing streams...`);
    BattleStreamRegistry.deleteBattleStream(battle.id);
    logger.log(`Removed battle ${battle.id} from activeBattleStreams`);
  }
};

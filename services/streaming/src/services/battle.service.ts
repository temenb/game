import * as battleClient from "../grpc/clients/battle.client";
import FrontBattleStreamRegistry from "../websocket/channels/front.battle.stream";
import {BattleObject, BattleStatus} from "../grpc/generated/battle";
import logger from "@shared/logger";
import * as profileGrpc from "../grpc/generated/profile";
import * as battleGrpc from "../grpc/generated/battle";

export const health = async () =>
  await battleClient.health();

export const status = async () =>
  await battleClient.status();

export const livez = async () =>
  await battleClient.livez();

export const readyz = async () =>
  await battleClient.readyz();

export const upsertBattle = async (req: profileGrpc.ProfileIdRequest) =>
  await battleClient.upsertBattle(req);

export const joinBattle = async (battleId: string, profileId: string) =>
  await battleClient.joinBattle(battleId, profileId);

export const updateBattle = async (battle: BattleObject) => {
  logger.log('update battle: battle');
  try {
    FrontBattleStreamRegistry.writeBattleStreams(battle);
  } catch (e) {
    logger.error(String(e));
  }

  if (battle.winner || battle.status != BattleStatus.ACTIVE) {
    logger.log(`Battle ${battle.id} finished. Closing streams...`);
    FrontBattleStreamRegistry.deleteBattleStream(battle.id);
    logger.log(`Removed battle ${battle.id} from activeBattleStreams`);
  }
};

import * as BattleClient from "../grpc/clients/battle.client";
import {getBattleStream} from "../grpc/handlers/battle.handler";
import {battleToGrpc} from "../lib/battle-grpc-prisma-converters";
import {BattleObject} from "../grpc/generated/battle";

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
    throw new Error(`No active streams found for battleId=${battle.id}`);
  }

  for (const stream of streams) {
    stream.write(battle);
  }
};


import * as BattleClient from "../grpc/clients/battle.client";
import * as grpc from "@grpc/grpc-js";

export const health = async () =>
  await BattleClient.health();

export const status = async () =>
  await BattleClient.status();

export const livez = async () =>
  await BattleClient.livez();

export const readyz = async () =>
  await BattleClient.readyz();

export const getBattleByUser = async (userId: string) =>
  await BattleClient.getBattleByUser(userId);

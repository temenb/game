import * as EngineClient from "../grpc/clients/engine.client";
import * as grpc from "@grpc/grpc-js";

export const health = async () =>
  await EngineClient.health();

export const status = async () =>
  await EngineClient.status();

export const livez = async () =>
  await EngineClient.livez();

export const readyz = async () =>
  await EngineClient.readyz();

export const makeMove = async (metadata: grpc.Metadata, battleId: string, colIdx: number, rowIdx: number) =>
  EngineClient.makeMove(metadata, battleId, colIdx, rowIdx);

export const newBattle = async (metadata: grpc.Metadata) =>
  EngineClient.newBattle(metadata);

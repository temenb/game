import * as EngineClient from "../grpc/clients/engine.client";
import * as EngineGrpc from '../grpc/generated/engine';

export const health = async () =>
  await EngineClient.health();

export const status = async () =>
  await EngineClient.status();

export const livez = async () =>
  await EngineClient.livez();

export const readyz = async () =>
  await EngineClient.readyz();

export const makeMove = async (move: EngineGrpc.BattleMoveRequest) =>
  await EngineClient.battleMove(move);


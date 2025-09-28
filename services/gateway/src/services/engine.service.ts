import * as EngineClient from "../grpc/clients/engine.client";

export const health = async () =>
  await EngineClient.health();

export const status = async () =>
  await EngineClient.status();

export const livez = async () =>
  await EngineClient.livez();

export const readyz = async () =>
  await EngineClient.readyz();

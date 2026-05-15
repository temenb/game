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

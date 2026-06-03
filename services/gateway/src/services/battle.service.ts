import * as battleClient from "../grpc/clients/battle.client";

export const health = async () =>
  await battleClient.health();

export const status = async () =>
  await battleClient.status();

export const livez = async () =>
  await battleClient.livez();

export const readyz = async () =>
  await battleClient.readyz();

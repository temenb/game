import * as SpawnerClient from "../grpc/clients/spawner.client";

export const health = async () =>
  await SpawnerClient.health();

export const status = async () =>
  await SpawnerClient.status();

export const livez = async () =>
  await SpawnerClient.livez();

export const readyz = async () =>
  await SpawnerClient.readyz();

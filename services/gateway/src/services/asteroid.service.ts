import * as SpawnClient from "../grpc/clients/spawn.client";

export const health = async () =>
  await SpawnClient.health();

export const status = async () =>
  await SpawnClient.status();

export const livez = async () =>
  await SpawnClient.livez();

export const readyz = async () =>
  await SpawnClient.readyz();

import * as AsteroidClient from "../grpc/clients/asteroid.client";

export const health = async () =>
  await AsteroidClient.health();

export const status = async () =>
  await AsteroidClient.status();

export const livez = async () =>
  await AsteroidClient.livez();

export const readyz = async () =>
  await AsteroidClient.readyz();

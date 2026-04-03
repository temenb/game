import * as FalloutClient from "../grpc/clients/fallout.client";

export const health = async () =>
  await FalloutClient.health();

export const status = async () =>
  await FalloutClient.status();

export const livez = async () =>
  await FalloutClient.livez();

export const readyz = async () =>
  await FalloutClient.readyz();

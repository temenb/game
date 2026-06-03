import * as orchestrationClient from "../grpc/clients/orchestration.client";

export const health = async () =>
  await orchestrationClient.health();

export const status = async () =>
  await orchestrationClient.status();

export const livez = async () =>
  await orchestrationClient.livez();

export const readyz = async () =>
  await orchestrationClient.readyz();

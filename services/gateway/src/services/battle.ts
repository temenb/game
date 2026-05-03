import * as OrchestrationClient from "../grpc/clients/orchestration.client";

export const health = async () =>
  await OrchestrationClient.health();

export const status = async () =>
  await OrchestrationClient.status();

export const livez = async () =>
  await OrchestrationClient.livez();

export const readyz = async () =>
  await OrchestrationClient.readyz();

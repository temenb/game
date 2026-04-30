import * as OrchestrationClient from "../grpc/clients/orchestration.client";
import * as ProfileClient from "../grpc/clients/profile.client";

export const health = async () =>
  await OrchestrationClient.health();

export const status = async () =>
  await OrchestrationClient.status();

export const livez = async () =>
  await OrchestrationClient.livez();

export const readyz = async () =>
  await OrchestrationClient.readyz();

export const viewMyProfile = async () =>
  await OrchestrationClient.viewMyProfile();

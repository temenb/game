import * as ProfileClient from "../grpc/clients/profile.client";
import * as grpc from "@grpc/grpc-js";
import * as OrchestrationClient from "../grpc/clients/orchestration.client";

export const health = async () =>
  await ProfileClient.health();

export const status = async () =>
  await ProfileClient.status();

export const livez = async () =>
  await ProfileClient.livez();

export const readyz = async () =>
  await ProfileClient.readyz();

export const getProfileByUser = async (userId: string) => {
  await OrchestrationClient.getProfileByUser(userId);
}

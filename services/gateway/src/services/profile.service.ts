import * as ProfileClient from "../grpc/clients/profile.client";
import * as grpc from "@grpc/grpc-js";
import * as OrchestrationClient from "../grpc/clients/orchestration.client";
import logger from "@shared/logger";

export const health = async () =>
  await ProfileClient.health();

export const status = async () =>
  await ProfileClient.status();

export const livez = async () =>
  await ProfileClient.livez();

export const readyz = async () =>
  await ProfileClient.readyz();

export const getMyProfile = async (jwt: string) => {
  const ddd = await OrchestrationClient.getMyProfile(jwt);
  logger.log(ddd);
  return ddd;
}

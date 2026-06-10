import * as profileClient from "../grpc/clients/profile.client";
import * as orchestrationClient from "../grpc/clients/orchestration.client";
import logger from "@shared/logger";

export const health = async () =>
  await profileClient.health();

export const status = async () =>
  await profileClient.status();

export const livez = async () =>
  await profileClient.livez();

export const readyz = async () =>
  await profileClient.readyz();

export const getMyProfile = async (jwt: string) => {
  return await orchestrationClient.getMyProfile(jwt);
}

export const getProfile = async (jwt: string, profileId: string) => {
  return await orchestrationClient.getProfile(jwt, profileId);
}

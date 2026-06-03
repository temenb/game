import * as ProfileClient from "../grpc/clients/profile.client";
import * as profileGrpc from "../grpc/generated/profile";

export const health = async () =>
  await ProfileClient.health();

export const status = async () =>
  await ProfileClient.status();

export const livez = async () =>
  await ProfileClient.livez();

export const readyz = async () =>
  await ProfileClient.readyz();

export const getProfileByUser = async (userId: string): Promise<profileGrpc.ProfileObject | null> =>
  await ProfileClient.getProfileByUser(userId);
import * as ProfileClient from "../grpc/clients/profile.client";

export const getProfileByUser = async (userId: string) =>
  await ProfileClient.getProfileByUser(userId);


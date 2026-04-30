import * as ProfileClient from "../grpc/clients/profile.client";

export const viewProfile = async (userId: string) =>
  await ProfileClient.viewProfile(userId);


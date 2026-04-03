import * as PawnClient from "../grpc/clients/pawn.client";

export const health = async () =>
  await PawnClient.health();

export const status = async () =>
  await PawnClient.status();

export const livez = async () =>
  await PawnClient.livez();

export const readyz = async () =>
  await PawnClient.readyz();

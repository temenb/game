import * as TestClient from "../grpc/clients/test.client";

export const health = async () =>
  await TestClient.health();

export const status = async () =>
  await TestClient.status();

export const livez = async () =>
  await TestClient.livez();

export const readyz = async () =>
  await TestClient.readyz();

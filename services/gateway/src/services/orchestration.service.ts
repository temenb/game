import * as TestClient from "../grpc/clients/test.client";
import * as grpc from "@grpc/grpc-js";

export const health = async () =>
  await TestClient.health();

export const status = async () =>
  await TestClient.status();

export const livez = async () =>
  await TestClient.livez();

export const readyz = async () =>
  await TestClient.readyz();

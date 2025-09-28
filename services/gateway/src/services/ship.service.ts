import * as ShipClient from "../grpc/clients/ship.client";

export const health = async () =>
  await ShipClient.health();

export const status = async () =>
  await ShipClient.status();

export const livez = async () =>
  await ShipClient.livez();

export const readyz = async () =>
  await ShipClient.readyz();

import * as grpc from '@grpc/grpc-js';
import * as ProfileGrpc from '../generated/profile';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import logger from "@shared/logger";

const profileManager = new GrpcClientManager<ProfileGrpc.ProfileClient>(() => {
  return new ProfileGrpc.ProfileClient(config.serviceProfileUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<HealthGrpc.HealthReport | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return profileManager.call<HealthGrpc.HealthReport>(
    (client, cb) => client.health(grpcRequest, cb)
  ).catch((err) => {
    logger.error("Health check failed:", err);
    return null;
  });
};

export const status = (): Promise<HealthGrpc.StatusInfo | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return profileManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<HealthGrpc.LiveStatus | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return profileManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<HealthGrpc.ReadyStatus | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return profileManager.call((client, cb) => client.readyz(grpcRequest, cb));
};


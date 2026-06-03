import * as grpc from '@grpc/grpc-js';
import * as authGrpc from '../generated/auth';
import * as profileGrpc from '../generated/profile';
import * as healthGrpc from '../generated/common/health';
import * as emptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import logger from "@shared/logger";

const profileManager = new GrpcClientManager<profileGrpc.ProfileClient>(() => {
  return new profileGrpc.ProfileClient(config.serviceProfileUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<healthGrpc.HealthReport | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return profileManager.call<healthGrpc.HealthReport>(
    (client, cb) => client.health(grpcRequest, cb)
  ).catch((err) => {
    logger.error("Health check failed:", err);
    return null;
  });
};

export const status = (): Promise<healthGrpc.StatusInfo | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return profileManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<healthGrpc.LiveStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return profileManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<healthGrpc.ReadyStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return profileManager.call((client, cb) => client.readyz(grpcRequest, cb));
};

export const getMyProfile = (userId: string): Promise<profileGrpc.ProfileObject | null> => {
  const grpcRequest: authGrpc.UserIdRequest = {userId};
  return profileManager.call((client, cb) => client.getProfileByUser(grpcRequest, cb));
};


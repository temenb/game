import * as grpc from '@grpc/grpc-js';
import * as OrchestrationGrpc from '../generated/orchestration';
import * as AuthGrpc from '../generated/auth';
import * as ProfileGrpc from '../generated/profile';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import logger from '@shared/logger';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const orchestrationManager = new GrpcClientManager<OrchestrationGrpc.OrchestrationClient>(() => {
  return new OrchestrationGrpc.OrchestrationClient(config.serviceOrchestrationUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<HealthGrpc.HealthReport | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return orchestrationManager.call<HealthGrpc.HealthReport>(
    (client, cb) => client.health(grpcRequest, cb)
  ).catch((err) => {
    logger.error("Health check failed:", err);
    return null;
  });
};

export const status = (): Promise<HealthGrpc.StatusInfo | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return orchestrationManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<HealthGrpc.LiveStatus | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return orchestrationManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<HealthGrpc.ReadyStatus | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return orchestrationManager.call((client, cb) => client.readyz(grpcRequest, cb));
};

export const getProfileByUser = (userId: string): Promise<ProfileGrpc.ProfileObject | null> => {
  const grpcRequest: AuthGrpc.UserIdRequest = { userId };
  return orchestrationManager.call((client, cb) => client.getProfileByUser(grpcRequest, cb));
};

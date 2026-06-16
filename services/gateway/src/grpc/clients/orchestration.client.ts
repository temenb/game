import * as grpc from '@grpc/grpc-js';
import * as orchestrationGrpc from '../generated/orchestration';
import * as profileGrpc from '../generated/profile';
import * as healthGrpc from '../generated/common/health';
import * as emptyGrpc from '../generated/common/empty';
import * as authGrpc from '../generated/auth';
import logger from '@shared/logger';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const orchestrationManager = new GrpcClientManager<orchestrationGrpc.OrchestrationClient>(() => {
  return new orchestrationGrpc.OrchestrationClient(config.serviceOrchestrationUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<healthGrpc.HealthReport | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return orchestrationManager.call<healthGrpc.HealthReport>(
    (client, cb) => client.health(grpcRequest, cb)
  ).catch((err) => {
    logger.error("Health check failed:", err);
    return null;
  });
};

export const status = (): Promise<healthGrpc.StatusInfo | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return orchestrationManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<healthGrpc.LiveStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return orchestrationManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<healthGrpc.ReadyStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return orchestrationManager.call((client, cb) => client.readyz(grpcRequest, cb));
};

export const anonymousSignIn = (deviceId: string): Promise<authGrpc.AuthObject | null> => {
  const grpcRequest: authGrpc.AnonymousSignInRequest = {deviceId};

  return orchestrationManager.call((client, cb) =>
    client.anonymousSignIn(grpcRequest, cb)
  );
};

export const refreshTokens = (token: string): Promise<authGrpc.AuthObject | null> => {
  const grpcRequest: authGrpc.RefreshTokensRequest = {token};

  return orchestrationManager.call((client, cb) =>
    client.refreshTokens(grpcRequest, cb)
  );
};

export const getMyUser = (jwt: string): Promise<authGrpc.UserObject | null> => {
  const grpcRequest: emptyGrpc.Empty = {};

  const metadata = new grpc.Metadata();
  metadata.add("authorization", `Bearer ${jwt}`);

  return orchestrationManager.call((client, cb) =>
    client.getMyUser(grpcRequest, metadata, cb)
  );
};

export const getMyProfile = (jwt: string): Promise<profileGrpc.ProfileObject | null> => {
  const grpcRequest: emptyGrpc.Empty = {};

  const metadata = new grpc.Metadata();
  metadata.add("authorization", `Bearer ${jwt}`);

  return orchestrationManager.call((client, cb) =>
    client.getMyProfile(grpcRequest, metadata, cb)
  );
};

export const getProfile = (jwt: string, profileId: string): Promise<profileGrpc.ProfileObject | null> => {
  const grpcRequest: profileGrpc.ProfileIdRequest = {profileId};

  const metadata = new grpc.Metadata();
  metadata.add("authorization", `Bearer ${jwt}`);

  return orchestrationManager.call((client, cb) =>
    client.getProfile(grpcRequest, metadata, cb)
  );
};


import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as ProfileGrpc from '../generated/profile';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";

const profileManager = new GrpcClientManager<ProfileGrpc.ProfileClient>(() => {
  return new ProfileGrpc.ProfileClient(config.serviceProfileUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<HealthGrpc.HealthReport | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return profileManager.call((client, cb) => client.health(grpcRequest, cb));
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

export const getMyProfile = (userId: string): Promise<ProfileGrpc.ProfileObject | null> => {
  const grpcRequest: AuthGrpc.UserIdRequest = {userId};
  return profileManager.call((client, cb) => client.getProfileByUser(grpcRequest, cb));
};

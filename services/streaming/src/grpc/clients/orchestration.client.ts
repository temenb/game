import * as grpc from '@grpc/grpc-js';
import * as TestGrpc from '../generated/test';
import * as ProfileGrpc from '../generated/profile';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import logger from '@shared/logger';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const testManager = new GrpcClientManager<TestGrpc.TestClient>(() => {
  return new TestGrpc.TestClient(config.serviceTestUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<HealthGrpc.HealthReport | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return testManager.call((client, cb) => client.health(grpcRequest, cb));
};

export const status = (): Promise<HealthGrpc.StatusInfo | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return testManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<HealthGrpc.LiveStatus | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return testManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<HealthGrpc.ReadyStatus | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return testManager.call((client, cb) => client.readyz(grpcRequest, cb));
};
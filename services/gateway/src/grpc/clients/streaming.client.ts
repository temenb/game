import * as grpc from '@grpc/grpc-js';
import * as streamingGrpc from '../generated/streaming';
import * as healthGrpc from '../generated/common/health';
import * as emptyGrpc from '../generated/common/empty';
import logger from '@shared/logger';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const streamingManager = new GrpcClientManager<streamingGrpc.StreamingClient>(() => {
  return new streamingGrpc.StreamingClient(config.serviceStreamingUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<healthGrpc.HealthReport | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return streamingManager.call<healthGrpc.HealthReport>(
    (client, cb) => client.health(grpcRequest, cb)
  ).catch((err) => {
    logger.error("Health check failed:", err);
    return null;
  });
};

export const status = (): Promise<healthGrpc.StatusInfo | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return streamingManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<healthGrpc.LiveStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return streamingManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<healthGrpc.ReadyStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return streamingManager.call((client, cb) => client.readyz(grpcRequest, cb));
};

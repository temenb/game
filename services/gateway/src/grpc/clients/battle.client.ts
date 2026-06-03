import * as grpc from '@grpc/grpc-js';
import * as battleGrpc from '../generated/battle';
import * as healthGrpc from '../generated/common/health';
import * as emptyGrpc from '../generated/common/empty';
import logger from '@shared/logger';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const battleManager = new GrpcClientManager<battleGrpc.BattleClient>(() => {
  return new battleGrpc.BattleClient(config.serviceBattleUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<healthGrpc.HealthReport | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return battleManager.call<healthGrpc.HealthReport>(
    (client, cb) => client.health(grpcRequest, cb)
  ).catch((err) => {
    logger.error("Health check failed:", err);
    return null;
  });
};

export const status = (): Promise<healthGrpc.StatusInfo | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return battleManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<healthGrpc.LiveStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return battleManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<healthGrpc.ReadyStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return battleManager.call((client, cb) => client.readyz(grpcRequest, cb));
};

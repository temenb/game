import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../generated/battle';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import * as ProfileGrpc from '../generated/profile';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import logger from "@shared/logger";

const battleManager = new GrpcClientManager<BattleGrpc.BattleClient>(() => {
  return new BattleGrpc.BattleClient(config.serviceBattleUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<HealthGrpc.HealthReport | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return battleManager.call((client, cb) => client.health(grpcRequest, cb));
};

export const status = (): Promise<HealthGrpc.StatusInfo | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return battleManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<HealthGrpc.LiveStatus | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return battleManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<HealthGrpc.ReadyStatus | null> => {
  const grpcRequest: EmptyGrpc.Empty = {};
  return battleManager.call((client, cb) => client.readyz(grpcRequest, cb));
};

export const getBattle = (battleId: string): Promise<BattleGrpc.BattleObject | null> => {
  const grpcRequest: BattleGrpc.BattleIdRequest = {battleId};
  return battleManager.call((client, cb) => client.getBattle(grpcRequest, cb));
};

export const upsertBattle = (grpcRequest: ProfileGrpc.ProfileIdRequest): Promise<BattleGrpc.BattleObject | null> => {
  return battleManager.call<BattleGrpc.BattleObject>(
    (client, cb) => client.upsertBattle(grpcRequest, cb)
  ).catch((err) => {
    logger.error("Upsert battle failed:", err);
    return null;
  });
};

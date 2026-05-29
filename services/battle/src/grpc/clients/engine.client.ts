import * as grpc from '@grpc/grpc-js';
import * as EngineGrpc from '../generated/engine';
import * as BattleGrpc from '../generated/battle';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const engineManager = new GrpcClientManager<EngineGrpc.EngineClient>(() => {
  return new EngineGrpc.EngineClient(config.serviceEngineUrl, grpc.credentials.createInsecure());
});

export const battleNew = (battle: BattleGrpc.BattleObject): Promise<EmptyGrpc.Empty | null> => {
  const join: EngineGrpc.BattleNewRequest = { battle };
  return engineManager.call((client, cb) => client.battleNew(join, cb));
};


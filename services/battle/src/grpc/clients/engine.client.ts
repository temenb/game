import * as grpc from '@grpc/grpc-js';
import * as engineGrpc from '../generated/engine';
import * as battleGrpc from '../generated/battle';
import * as emptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const engineManager = new GrpcClientManager<engineGrpc.EngineClient>(() => {
  return new engineGrpc.EngineClient(config.serviceEngineUrl, grpc.credentials.createInsecure());
});

export const battleNew = (battle: battleGrpc.BattleObject): Promise<emptyGrpc.Empty | null> => {
  const join: engineGrpc.BattleNewRequest = {battle};
  return engineManager.call((client, cb) => client.battleNew(join, cb));
};


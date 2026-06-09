import * as grpc from '@grpc/grpc-js';
import * as battleGrpc from '../generated/battle';
import * as emptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const battleManager = new GrpcClientManager<battleGrpc.BattleClient>(() => {
  return new battleGrpc.BattleClient(config.serviceBattleUrl, grpc.credentials.createInsecure());
});

export const battleNew = (battle: battleGrpc.BattleObject): Promise<emptyGrpc.Empty | null> => {
  const join: battleGrpc.BattleNewRequest = {battle};
  return battleManager.call((client, cb) => client.battleNew(join, cb));
};


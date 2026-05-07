import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../generated/battle';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import logger from '@shared/logger';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const battleManager = new GrpcClientManager<BattleGrpc.BattleClient>(() => {
  return new BattleGrpc.BattleClient(config.serviceBattleUrl, grpc.credentials.createInsecure());
});

// export const newBattle = async (metadata: grpc.Metadata): Promise<BattleGrpc.BattleObject | null> => {
//   const grpcRequest: EmptyGrpc.Empty = {};
//
//   return battleManager.call((client, cb) => client.newBattle(grpcRequest, metadata, cb));
// };
//
// export const makeMove = async (metadata: grpc.Metadata, battleId: string, colIdx: number, rowIdx: number): Promise<BattleGrpc.BattleObject | null> => {
//   const grpcRequest: BattleGrpc.MakeMoveRequest = {battleId, colIdx, rowIdx};
//   return battleManager.call((client, cb) => client.makeMove(grpcRequest, metadata, cb));
// };



import * as grpc from '@grpc/grpc-js';
import * as emptyGrpc from '../generated/common/empty';
import * as battleGrpc from '../generated/battle';
import * as engineGrpc from '../generated/engine';
import * as battleService from '../../services/battle.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";


export const battleMove = async (
  call: grpc.ServerUnaryCall<engineGrpc.BattleMoveRequest, emptyGrpc.Empty>,
  callback: grpc.sendUnaryData<emptyGrpc.Empty>
) => {
  try {
    const battleMoveRequest = call.request;

    await battleService.makeMove(battleMoveRequest);
    callback(null, {});
  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const battleNew = async (
  call: grpc.ServerUnaryCall<engineGrpc.BattleNewRequest, emptyGrpc.Empty>,
  callback: grpc.sendUnaryData<emptyGrpc.Empty>
) => {
  try {
    const battle: battleGrpc.BattleObject = call.request.battle as battleGrpc.BattleObject;

    await battleService.battleNew(battle);
    callback(null, {});
  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

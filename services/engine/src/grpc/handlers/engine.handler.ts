import * as grpc from '@grpc/grpc-js';
import * as EmptyGrpc from '../generated/common/empty';
import * as BattleGrpc from '../generated/battle';
import * as EngineGrpc from '../generated/engine';
import * as battleService from '../../services/battle.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import {BattleObject} from "../generated/battle";


export const battleMove = async (
  call: grpc.ServerUnaryCall<EngineGrpc.BattleMoveRequest, EmptyGrpc.Empty>,
  callback: grpc.sendUnaryData<EmptyGrpc.Empty>
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
  call: grpc.ServerUnaryCall<EngineGrpc.BattleNewRequest, EmptyGrpc.Empty>,
  callback: grpc.sendUnaryData<EmptyGrpc.Empty>
) => {
  try {
    const battle:BattleGrpc.BattleObject = call.request.battle as BattleGrpc.BattleObject;

    await battleService.battleNew(battle);
    callback(null, {});
  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

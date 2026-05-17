import * as grpc from '@grpc/grpc-js';
import * as EmptyGrpc from '../generated/common/empty';
import * as ProfileGrpc from '../generated/profile';
import * as BattleGrpc from '../generated/battle';
import * as EngineGrpc from '../generated/engine';
import * as battleService from '../../services/battle.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";
import {forwardAuthMetadata} from "../../lib/authMetadata";


export const makeMove = async (
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

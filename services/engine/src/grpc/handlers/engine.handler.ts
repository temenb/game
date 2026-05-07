import * as grpc from '@grpc/grpc-js';
import * as EmptyGrpc from '../generated/common/empty';
import * as ProfileGrpc from '../generated/profile';
import * as BattleGrpc from '../generated/battle';
import * as battleService from '../../services/battle.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";
import {forwardAuthMetadata} from "../../lib/authMetadata";


export const newBattle = async (
  call: grpc.ServerUnaryCall<EmptyGrpc.Empty, BattleGrpc.BattleObject>,
  callback: grpc.sendUnaryData<EmptyGrpc.Empty>
) => {
  try {
    const metadata = forwardAuthMetadata(call);
    battleService.newBattle(metadata);
    callback(null, {});
  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const makeMove = async (
  call: grpc.ServerUnaryCall<BattleGrpc.MakeMoveRequest, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<EmptyGrpc.Empty>
) => {
  try {
    const metadata = forwardAuthMetadata(call);
    const {battleId, colIdx, rowIdx} = call.request;
    battleService.makeMove(metadata, battleId, colIdx, rowIdx);
    callback(null, {});
  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};
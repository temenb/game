import * as grpc from '@grpc/grpc-js';
import * as GameBoardGrpc from '../generated/gameBoard';
import * as GameBoardService from '../../services/gameBoard.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";

export const upsert = async (
  call: grpc.ServerUnaryCall<GameBoardGrpc.UserIdRequest, GameBoardGrpc.GameBoardObject>,
  callback: grpc.sendUnaryData<GameBoardGrpc.GameBoardObject>
) => {
  const {userId} = call.request;

  try {
    const result = await GameBoardService.upsertGameBoard(userId);

    callback(null, {
      id: result.id,
      ownerId: result.ownerId,
      nickname: result.nickname,
      level: result.level,
      rating: result.rating,
      experience: result.experience,
    });

  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, null);
  }
};

  export const viewGameBoardByUser = async (
  call: grpc.ServerUnaryCall<GameBoardGrpc.UserIdRequest, GameBoardGrpc.GameBoardObject>,
  callback: grpc.sendUnaryData<GameBoardGrpc.GameBoardObject>
) => {
  const {userId} = call.request;

  try {
    const result = await GameBoardService.getGameBoard(userId);

    if (!result) {
      throw new Error("Expected result, but got null");
    }

    callback(null, {
      id: result.id,
      ownerId: result.ownerId,
      nickname: result.nickname,
      level: result.level,
      rating: result.rating,
      experience: result.experience,
    });

  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, null);
  }
};

import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as EngineGrpc from '../generated/engine';
import * as BattleGrpc from '../generated/battle';
import * as ProfileGrpc from '../generated/profile';
import * as AuthService from '../../services/auth.service';
import * as EngineService from '../../services/engine.service';
import * as ProfileService from "../../services/profile.service";
import * as OrchestrationService from '../../services/orchestration.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import * as EmptyGrpc from "../generated/common/empty";
import {forwardAuthMetadata} from "../../lib/authMetadata";


export const anonymousSignIn = async (
  call: grpc.ServerUnaryCall<AuthGrpc.AnonymousSignInRequest, AuthGrpc.AuthObject>,
  callback: grpc.sendUnaryData<AuthGrpc.AuthObject>
) => {
  const {deviceId} = call.request;
  try {
    const result = await AuthService.anonymousSignIn(deviceId);
    callback(null, result);
  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, undefined);
  }
};

export const refreshTokens = async (
  call: grpc.ServerUnaryCall<AuthGrpc.RefreshTokensRequest, AuthGrpc.AuthObject>,
  callback: grpc.sendUnaryData<AuthGrpc.AuthObject>
) => {
  const {token} = call.request;
  try {
    const result = await AuthService.refreshTokens(token);
    callback(null, result);
  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const getMyProfile = async (
  call: grpc.ServerUnaryCall<EmptyGrpc.Empty, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
) => {
  try {
    const metadata = forwardAuthMetadata(call);
    const result = await ProfileService.getMyProfile(metadata);
    callback(null, result);
  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, undefined);
  }
};

export const getMyBattle = async (
  call: grpc.ServerUnaryCall<EmptyGrpc.Empty, BattleGrpc.BattleObject>,
  callback: grpc.sendUnaryData<EmptyGrpc.Empty>
) => {
  try {
    const metadata = forwardAuthMetadata(call);
    EngineService.newBattle(metadata);
    callback(null, {});
  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, undefined);
  }
};

export const makeMove = async (
  call: grpc.ServerUnaryCall<BattleGrpc.MakeMoveRequest, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<EmptyGrpc.Empty>
) => {
  try {
    const metadata = forwardAuthMetadata(call);
    const {battleId, colIdx, rowIdx} = call.request;
    EngineService.makeMove(metadata, battleId, colIdx, rowIdx);
    callback(null, {});
  } catch (err: any) {
    logger.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, undefined);
  }
};

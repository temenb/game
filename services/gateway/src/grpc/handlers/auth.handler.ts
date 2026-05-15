import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as AuthService from '../../services/auth.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";


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


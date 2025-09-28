import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as ProfileGrpc from '../generated/profile';
import * as AuthService from '../../services/auth.service';
import * as ProfileService from '../../services/profile.service';
import {callbackError} from './callback.error';


export const anonymousSignIn = async (
  call: grpc.ServerUnaryCall<AuthGrpc.AnonymousSignInRequest, AuthGrpc.AuthObject>,
  callback: grpc.sendUnaryData<AuthGrpc.AuthObject>
) => {
  const { deviceId } = call.request;
  try {
    const result = await AuthService.anonymousSignIn(deviceId);
    callback(null, result);
  } catch (err: any) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, undefined);
  }
};

export const viewProfile = async (
  call: grpc.ServerUnaryCall<ProfileGrpc.ViewRequest, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
) => {
  const { id } = call.request;
  try {
    const result = await ProfileService.getProfile(id);
    callback(null, result);
  } catch (err: any) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    }, undefined);
  }
};

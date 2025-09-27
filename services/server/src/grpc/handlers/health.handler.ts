import * as grpc from '@grpc/grpc-js';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import * as heathService from '../../services/health.service';
import {callbackError} from './callback.error';

export const health = async (
  call: grpc.ServerUnaryCall<EmptyGrpc.Empty, HealthGrpc.HealthReport>,
  callback: grpc.sendUnaryData<HealthGrpc.HealthReport>
) => {
  try {
    const response = await heathService.health();

    callback(null, response);

  } catch (err: any) {
    callbackError(callback, err);
  }
};

export const status = async (
  call: grpc.ServerUnaryCall<EmptyGrpc.Empty, HealthGrpc.StatusInfo>,
  callback: grpc.sendUnaryData<HealthGrpc.StatusInfo>
) => {
  try {
    const response = await heathService.status();

    callback(null, response);

  } catch (err: any) {
    callbackError(callback, err);
  }
};

export const livez = async (
  call: grpc.ServerUnaryCall<EmptyGrpc.Empty, HealthGrpc.LiveStatus>,
  callback: grpc.sendUnaryData<HealthGrpc.LiveStatus>
) => {
  try {
    const response = await heathService.livez();

    callback(null, response);

  } catch (err: any) {
    callbackError(callback, err);
  }
};

export const readyz = async (
  call: grpc.ServerUnaryCall<EmptyGrpc.Empty, HealthGrpc.ReadyStatus>,
  callback: grpc.sendUnaryData<HealthGrpc.ReadyStatus>
) => {
  try {
    const response = await heathService.readyz();

    callback(null, response);

  } catch (err: any) {
    callbackError(callback, err);
  }
};

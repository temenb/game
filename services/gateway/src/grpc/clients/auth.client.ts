import * as grpc from '@grpc/grpc-js';
import * as authGrpc from '../generated/auth';
import * as healthGrpc from '../generated/common/health';
import * as emptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import logger from "@shared/logger";

const authManager = new GrpcClientManager<authGrpc.AuthClient>(() => {
  return new authGrpc.AuthClient(config.serviceAuthUrl, grpc.credentials.createInsecure());
});

export const health = (): Promise<healthGrpc.HealthReport | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return authManager.call<healthGrpc.HealthReport>(
    (client, cb) => client.health(grpcRequest, cb)
  ).catch((err) => {
    logger.error("Health check failed:", err);
    return null;
  });
};

export const status = (): Promise<healthGrpc.StatusInfo | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return authManager.call((client, cb) => client.status(grpcRequest, cb));
};

export const livez = (): Promise<healthGrpc.LiveStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return authManager.call((client, cb) => client.livez(grpcRequest, cb));
};

export const readyz = (): Promise<healthGrpc.ReadyStatus | null> => {
  const grpcRequest: emptyGrpc.Empty = {};
  return authManager.call((client, cb) => client.readyz(grpcRequest, cb));
};

// export const register = (email: string, password: string): Promise<authGrpc.AuthObject | null> => {
//   const grpcRequest: authGrpc.RegisterRequest = {email, password};
//   return authManager.call((client, cb) => client.register(grpcRequest, cb));
// };

export const anonymousSignIn = (grpcRequest: authGrpc.AnonymousSignInRequest): Promise<authGrpc.AuthObject | null> => {
  logger.log(grpcRequest);
  return authManager.call((client, cb) => client.anonymousSignIn(grpcRequest, cb));
};

// export const login = (email: string, password: string): Promise<authGrpc.AuthObject | null> => {
//   const grpcRequest: authGrpc.LoginRequest = {email, password};
//   return authManager.call((client, cb) => client.login(grpcRequest, cb));
// };

export const refreshTokens = (grpcRequest: authGrpc.RefreshTokensRequest): Promise<authGrpc.AuthObject | null> => {
  return authManager.call((client, cb) => client.refreshTokens(grpcRequest, cb));
};

// export const logout = (userId: string): Promise<authGrpc.LogoutResponse | null> => {
//   const grpcRequest: authGrpc.LogoutRequest = {userId};
//   return authManager.call((client, cb) => client.logout(grpcRequest, cb));
// };
//
// export const forgotPassword = (email: string): Promise<emptyGrpc.Empty | null> => {
//   const grpcRequest: authGrpc.ForgotPasswordRequest = {email};
//   return authManager.call((client, cb) => client.forgotPassword(grpcRequest, cb));
// };
//
// export const resetPassword = (token: string, newPassword: string): Promise<authGrpc.AuthObject | null> => {
//   const grpcRequest: authGrpc.ResetPasswordRequest = {token, newPassword};
//   return authManager.call((client, cb) => client.resetPassword(grpcRequest, cb));
// };

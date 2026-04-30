import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const authManager = new GrpcClientManager<AuthGrpc.AuthClient>(() => {
  return new AuthGrpc.AuthClient(config.serviceAuthUrl, grpc.credentials.createInsecure());
});

export const register = (email: string, password: string): Promise<AuthGrpc.AuthObject | null> => {
  const grpcRequest: AuthGrpc.RegisterRequest = {email, password};
  return authManager.call((client, cb) => client.register(grpcRequest, cb));
};

export const anonymousSignIn = (deviceId: string): Promise<AuthGrpc.AuthObject | null> => {
  const grpcRequest: AuthGrpc.AnonymousSignInRequest = {deviceId};
  return authManager.call((client, cb) => client.anonymousSignIn(grpcRequest, cb));
};

export const login = (email: string, password: string): Promise<AuthGrpc.AuthObject | null> => {
  const grpcRequest: AuthGrpc.LoginRequest = {email, password};
  return authManager.call((client, cb) => client.login(grpcRequest, cb));
};

export const refreshTokens = (token: string): Promise<AuthGrpc.AuthObject | null> => {
  const grpcRequest: AuthGrpc.RefreshTokensRequest = {token};
  return authManager.call((client, cb) => client.refreshTokens(grpcRequest, cb));
};

export const logout = (userId: string): Promise<AuthGrpc.LogoutResponse | null> => {
  const grpcRequest: AuthGrpc.LogoutRequest = {userId};
  return authManager.call((client, cb) => client.logout(grpcRequest, cb));
};

export const forgotPassword = (email: string): Promise<EmptyGrpc.Empty | null> => {
  const grpcRequest: AuthGrpc.ForgotPasswordRequest = {email};
  return authManager.call((client, cb) => client.forgotPassword(grpcRequest, cb));
};

export const resetPassword = (token: string, newPassword: string): Promise<AuthGrpc.AuthObject | null> => {
  const grpcRequest: AuthGrpc.ResetPasswordRequest = {token, newPassword};
  return authManager.call((client, cb) => client.resetPassword(grpcRequest, cb));
};

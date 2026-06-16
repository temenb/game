import * as authClient from '../grpc/clients/auth.client';
import {AnonymousSignInRequest, RefreshTokensRequest} from '../grpc/generated/auth';
import * as orchestrationClient from "../grpc/clients/orchestration.client";

export const health = async () =>
  await authClient.health();

export const status = async () =>
  await authClient.status();

export const livez = async () =>
  await authClient.livez();

export const readyz = async () =>
  await authClient.readyz();

export const refreshTokens = async (request: RefreshTokensRequest) =>
  await orchestrationClient.refreshTokens(request.token);

export const anonymousSignIn = async (request: AnonymousSignInRequest) => {
  return await orchestrationClient.anonymousSignIn(request.deviceId);
}

export const getMyUser = async (jwt: string) => {
  return await orchestrationClient.getMyUser(jwt);
}

// export const register = async (email: string, password: string) =>
//   await authClient.register(email, password);
//
// export const login = async (email: string, password: string) =>
//   await authClient.login(email, password);
//
// export const logout = async (userId: string) =>
//   await authClient.logout(userId);
//
// export const forgotPassword = async (email: string) =>
//   await authClient.forgotPassword(email);
//
// export const resetPassword = async (token: string, newPassword: string) =>
//   await authClient.resetPassword(token, newPassword);




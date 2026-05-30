import * as AuthClient from '../grpc/clients/auth.client';
import * as AuthGrpc from '../grpc/generated/auth';
import logger from "@shared/logger";
import {AnonymousSignInRequest, RefreshTokensRequest} from "../grpc/generated/auth";

export const health = async () =>
  await AuthClient.health();

export const status = async () =>
  await AuthClient.status();

export const livez = async () =>
  await AuthClient.livez();

export const readyz = async () =>
  await AuthClient.readyz();

export const refreshTokens = async (request: RefreshTokensRequest) =>
  await AuthClient.refreshTokens(request);

export const anonymousSignIn = async (request: AnonymousSignInRequest) => {
  return await AuthClient.anonymousSignIn(request);
}


// export const register = async (email: string, password: string) =>
//   await AuthClient.register(email, password);
//
// export const login = async (email: string, password: string) =>
//   await AuthClient.login(email, password);
//
// export const logout = async (userId: string) =>
//   await AuthClient.logout(userId);
//
// export const forgotPassword = async (email: string) =>
//   await AuthClient.forgotPassword(email);
//
// export const resetPassword = async (token: string, newPassword: string) =>
//   await AuthClient.resetPassword(token, newPassword);




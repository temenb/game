import * as AuthClient from '../grpc/clients/auth.client';
import logger from "@shared/logger";

export const register = async (email: string, password: string) =>
  await AuthClient.register(email, password);

export const login = async (email: string, password: string) =>
  await AuthClient.login(email, password);

export const refreshTokens = async (token: string) =>
  await AuthClient.refreshTokens(token);

export const logout = async (userId: string) =>
  await AuthClient.logout(userId);

export const forgotPassword = async (email: string) =>
  await AuthClient.forgotPassword(email);

export const resetPassword = async (token: string, newPassword: string) =>
  await AuthClient.resetPassword(token, newPassword);

export const health = async () =>
  await AuthClient.health();

export const status = async () =>
  await AuthClient.status();

export const livez = async () =>
  await AuthClient.livez();

export const readyz = async () =>
  await AuthClient.readyz();

export const anonymousSignIn = async (deviceId: string) => {
  return await AuthClient.anonymousSignIn(deviceId);
}

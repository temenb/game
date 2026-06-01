import * as AuthService from "../../services/auth.service";
import getUserId from "../../lib/getUserId";
import wrapper from "./wrapper";
import {AnonymousSignInRequest, RefreshTokensRequest} from "../../grpc/generated/auth";
import logger from "@shared/logger";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return await AuthService.health();
});

export const status = wrapper(async (req, res) => {
  return await AuthService.status();
});

export const livez = wrapper(async (req, res) => {
  return await AuthService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return await AuthService.readyz();
});

export const anonymousSignIn = wrapper(async (req, res) => {
  const request = req.body as AnonymousSignInRequest;
  // logger.log(request);
  return await AuthService.anonymousSignIn(request);
});

export const refreshTokens = wrapper(async (req, res) => {
  const request = req.body as RefreshTokensRequest;
  // logger.log(request);
  return await AuthService.refreshTokens(request);
});

// export const register = wrapper(async (req, res) => {
//   const {email, password} = req.body;
//   return AuthService.register(email, password);
// });
//
// export const login = wrapper(async (req, res) => {
//   const {email, password} = req.body;
//   return AuthService.login(email, password);
// });
//
// export const logout = wrapper(async (req, res) => {
//   const userId = getUserId(req);
//   return AuthService.logout(userId);
// });
//
// export const forgotPassword = wrapper(async (req, res) => {
//   const email = req.body.email;
//   return AuthService.forgotPassword(email);
// });
//
// export const resetPassword = wrapper(async (req, res) => {
//   const {token, newPassword} = req.body;
//   return AuthService.resetPassword(token, newPassword);
// });


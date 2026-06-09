import * as authService from "../../services/auth.service";
import wrapper from "./wrapper";
import {AnonymousSignInRequest, RefreshTokensRequest} from "../../grpc/generated/auth";
import logger from "@shared/logger";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return await authService.health();
});

export const status = wrapper(async (req, res) => {
  return await authService.status();
});

export const livez = wrapper(async (req, res) => {
  return await authService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return await authService.readyz();
});

export const anonymousSignIn = wrapper(async (req, res) => {
  const request = req.body as AnonymousSignInRequest;

  // logger.log(request);

  await authService.anonymousSignIn(request);
  return authService.anonymousSignIn(request)
});

export const refreshTokens = wrapper(async (req, res) => {
  const request = req.body as RefreshTokensRequest;
  // logger.log(request);
  return await authService.refreshTokens(request);
});

// export const register = wrapper(async (req, res) => {
//   const {email, password} = req.body;
//   return authService.register(email, password);
// });
//
// export const login = wrapper(async (req, res) => {
//   const {email, password} = req.body;
//   return authService.login(email, password);
// });
//
// export const logout = wrapper(async (req, res) => {
//   const userId = getUserId(req);
//   return authService.logout(userId);
// });
//
// export const forgotPassword = wrapper(async (req, res) => {
//   const email = req.body.email;
//   return authService.forgotPassword(email);
// });
//
// export const resetPassword = wrapper(async (req, res) => {
//   const {token, newPassword} = req.body;
//   return authService.resetPassword(token, newPassword);
// });


import * as AuthService from "../../services/auth.service";
import getUserId from "../../utils/getUserId";
import wrapper from "./wrapper";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return AuthService.health();
});

export const status = wrapper(async (req, res) => {
  return AuthService.status();
});

export const livez = wrapper(async (req, res) => {
  return AuthService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return AuthService.readyz();
});

export const register = wrapper(async (req, res) => {
  const {email, password} = req.body;
  return AuthService.register(email, password);
});

export const login = wrapper(async (req, res) => {
  const {email, password} = req.body;
  return AuthService.login(email, password);
});

export const refreshTokens = wrapper(async (req, res) => {
  const token = req.body.token;
  return AuthService.refreshTokens(token);
});

export const logout = wrapper(async (req, res) => {
  const userId = getUserId(req);
  return AuthService.logout(userId);
});

export const forgotPassword = wrapper(async (req, res) => {
  const email = req.body.email;
  return AuthService.forgotPassword(email);
});

export const resetPassword = wrapper(async (req, res) => {
  const {token, newPassword} = req.body;
  return AuthService.resetPassword(token, newPassword);
});

export const anonymousSignIn = wrapper(async (req, res) => {
  const deviceId = String(req.query.deviceId);
  return AuthService.anonymousSignIn(deviceId);
});

import * as FalloutService from "../../services/fallout.service";
import wrapper from "./wrapper";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return FalloutService.health();
});

export const status = wrapper(async (req, res) => {
  return FalloutService.status();
});

export const livez = wrapper(async (req, res) => {
  return FalloutService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return FalloutService.readyz();
});

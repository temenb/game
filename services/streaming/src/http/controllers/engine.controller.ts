import * as EngineService from "../../services/engine.service";
import wrapper from "./wrapper";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return EngineService.health();
});

export const status = wrapper(async (req, res) => {
  return EngineService.status();
});

export const livez = wrapper(async (req, res) => {
  return EngineService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return EngineService.readyz();
});

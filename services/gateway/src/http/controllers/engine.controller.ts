import * as EngineService from "../../services/engine.service";
import wrapper from "./wrapper";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return await EngineService.health();
});

export const status = wrapper(async (req, res) => {
  return await EngineService.status();
});

export const livez = wrapper(async (req, res) => {
  return await EngineService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return await EngineService.readyz();
});

import * as engineService from "../../services/engine.service";
import wrapper from "./wrapper";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return await engineService.health();
});

export const status = wrapper(async (req, res) => {
  return await engineService.status();
});

export const livez = wrapper(async (req, res) => {
  return await engineService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return await engineService.readyz();
});

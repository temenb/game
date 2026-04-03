import * as SpawnService from "../../services/spawner.service";
import wrapper from "./wrapper";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return SpawnService.health();
});

export const status = wrapper(async (req, res) => {
  return SpawnService.status();
});

export const livez = wrapper(async (req, res) => {
  return SpawnService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return SpawnService.readyz();
});

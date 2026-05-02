import * as SpawnerService from "../../services/spawner.service";
import wrapper from "./wrapper";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return SpawnerService.health();
});

export const status = wrapper(async (req, res) => {
  return SpawnerService.status();
});

export const livez = wrapper(async (req, res) => {
  return SpawnerService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return SpawnerService.readyz();
});

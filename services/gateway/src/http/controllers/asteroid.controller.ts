import * as AsteroidService from "../../services/asteroid.service";
import wrapper from "./wrapper";

// Middleware-функции для роутов
export const health = wrapper(async (req, res) => {
  return AsteroidService.health();
});

export const status = wrapper(async (req, res) => {
  return AsteroidService.status();
});

export const livez = wrapper(async (req, res) => {
  return AsteroidService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return AsteroidService.readyz();
});

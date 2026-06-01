import * as HealthService from "../../services/health.service";
import wrapper from "./wrapper";

export const health = wrapper(async (req, res) => {
  if (req.query.full) {
    return await HealthService.fullHealth();
  } else {
    return await HealthService.health();
  }
});

export const fullHealth = wrapper(async (req, res) => {
  return await HealthService.fullHealth();
});

export const status = wrapper(async (req, res) => {
  return await HealthService.status();
});

export const livez = wrapper(async (req, res) => {
  return await HealthService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return await HealthService.readyz();
});

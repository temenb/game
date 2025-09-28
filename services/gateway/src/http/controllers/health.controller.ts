import * as HealthService from "../../services/health.service";
import wrapper from "./wrapper";

export const health = wrapper(async (req, res) => {
  return HealthService.health();
});

export const fullHealth = wrapper(async (req, res) => {
  return HealthService.fullHealth();
});

export const status = wrapper(async (req, res) => {
  return HealthService.status();
});

export const livez = wrapper(async (req, res) => {
  return HealthService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return HealthService.readyz();
});

import * as healthService from "../../services/health.service";
import wrapper from "./wrapper";

export const health = wrapper(async (req, res) => {
  if (req.query.full) {
    return await healthService.fullHealth();
  } else {
    return await healthService.health();
  }
});

export const fullHealth = wrapper(async (req, res) => {
  return await healthService.fullHealth();
});

export const status = wrapper(async (req, res) => {
  return await healthService.status();
});

export const livez = wrapper(async (req, res) => {
  return await healthService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return await healthService.readyz();
});

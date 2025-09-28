import * as ShipService from "../../services/profile.service";
import wrapper from "./wrapper";

export const health = wrapper(async (req, res) => {
  return ShipService.health();
});

export const status = wrapper(async (req, res) => {
  return ShipService.status();
});

export const livez = wrapper(async (req, res) => {
  return ShipService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return ShipService.readyz();
});

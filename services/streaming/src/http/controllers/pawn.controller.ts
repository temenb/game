import * as PawnService from "../../services/profile.service";
import wrapper from "./wrapper";

export const health = wrapper(async (req, res) => {
  return PawnService.health();
});

export const status = wrapper(async (req, res) => {
  return PawnService.status();
});

export const livez = wrapper(async (req, res) => {
  return PawnService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return PawnService.readyz();
});

import * as profileService from "../../services/profile.service";
import wrapper from "./wrapper";
import {getJwt} from "../../lib/authMetadata";

export const health = wrapper(async (req, res) => {
  return await profileService.health();
});

export const status = wrapper(async (req, res) => {
  return await profileService.status();
});

export const livez = wrapper(async (req, res) => {
  return await profileService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return await profileService.readyz();
});

export const getMyProfile = wrapper(async (req, res) => {
  const jwt = getJwt(req);
  return await profileService.getMyProfile(jwt)
});

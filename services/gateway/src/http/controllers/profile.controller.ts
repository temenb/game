import * as ProfileService from "../../services/profile.service";
import wrapper from "./wrapper";
import getUserId from '../../lib/getUserId';
import {getJwt} from "../../lib/authMetadata";
import logger from "@shared/logger";

export const health = wrapper(async (req, res) => {
  return await ProfileService.health();
});

export const status = wrapper(async (req, res) => {
  return await ProfileService.status();
});

export const livez = wrapper(async (req, res) => {
  return await ProfileService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return await ProfileService.readyz();
});

export const getMyProfile = wrapper(async (req, res) => {
  const jwt = getJwt(req);
  return await ProfileService.getMyProfile(jwt)
});

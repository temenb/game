import * as profileService from "../../services/profile.service";
import {Request} from "express";
import wrapper from "./wrapper";
import {getJwt} from "../../lib/authMetadata";
import logger from "@shared/logger";

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

export const getProfile = wrapper(async (req: Request, res) => {
  const jwt = getJwt(req);
  // logger.info(req);
  const profileId = req.query.profileId as string;

  if (!profileId) {
    return res.status(400).json({error: "No profileId provided"});
  }

  return await profileService.getProfile(jwt, profileId)
});

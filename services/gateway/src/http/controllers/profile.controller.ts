import * as ProfileService from "../../services/profile.service";
import wrapper from "./wrapper";
import getUserId from '../../utils/getUserId';

export const health = wrapper(async (req, res) => {
  return ProfileService.health();
});

export const status = wrapper(async (req, res) => {
  return ProfileService.status();
});

export const livez = wrapper(async (req, res) => {
  return ProfileService.livez();
});

export const readyz = wrapper(async (req, res) => {
  return ProfileService.readyz();
});

export const getProfile = wrapper(async (req, res) => {
  const userId = getUserId(req);

  return ProfileService.getProfile(userId);
});

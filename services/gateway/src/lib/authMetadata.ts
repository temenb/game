import {Request} from "express";
import jwt from "jsonwebtoken";
import logger from "@shared/logger";

export function getJwt(req: Request): string {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.slice(7); // убираем "Bearer "
  // logger.log(authHeader);
  // logger.log(token);
  // jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
  return token;
}

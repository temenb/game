import jwt from 'jsonwebtoken';
import config from '../config/config';
import {Request} from 'express';

const JWT_SECRET = config.jwtAccessSecret;

export const getUserId = (req: Request): string => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);

  const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
  if (!payload.sub) {
    throw new Error('JWT payload missing sub');
  }

  return payload.sub;
};
export default getUserId;
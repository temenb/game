import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {config} from '../config/config';
import * as AuthGrpc from "../generated/auth";


type RegisterAnonymousCallback = () => Promise<AuthGrpc.AuthResponse>;

export const verifyToken = (registerAnonymousCallback: RegisterAnonymousCallback) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      try {
        const authResponse = await registerAnonymousCallback();
        token = authResponse.accessToken;
        res.cookie('accessToken', token, {httpOnly: true});
      } catch (err) {
        return res.status(401).json({message: 'Unauthorized: cannot register anonymous user'});
      }
    }

    try {
      const decoded = jwt.verify(token, config.jwtAccessSecret!);
      (req as any).user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({message: 'Invalid token'});
    }
  };
};

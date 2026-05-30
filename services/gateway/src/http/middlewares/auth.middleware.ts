import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import config from "../../config/config";
import logger from "@shared/logger";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(' ')[1];

  // logger.log(token);

  if (!token) {
    return res.status(401).json({message: 'Token is missing'});
  }

  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({message: 'Invalid token'});
  }
};

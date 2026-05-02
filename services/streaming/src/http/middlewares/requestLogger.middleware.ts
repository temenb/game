import {NextFunction, Request, Response} from 'express';

export const traceRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`📡 [${req.method}] ${req.originalUrl} → From: ${req.ip}`);
  next();
};

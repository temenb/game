import {Request, Response} from "express";

// Обёртка, пробрасывающая req/res
export default function wrapper<T>(fn: (req: Request, res: Response) => Promise<T>) {
  return async (req: Request, res: Response) => {
    try {
      const response = await fn(req, res);
      res.status(200).json(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({error: message});
    }
  };
}

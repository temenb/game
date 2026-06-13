import express, {NextFunction, Request, Response} from 'express';
import morgan from 'morgan';
import gatewayRoutes from './routes/gateway.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import {verifyToken} from "./middlewares/auth.middleware";
import publicPaths from "./routes/public.paths";
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors({
  origin: '*', // ['http://localhost:8080']
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use(cookieParser());

const withAuth = (req: Request, res: Response, next: NextFunction) => {
  const isPublic = publicPaths.some(path => req.path.startsWith('/' + path));
  // logger.log('req.path',req.path);
  // logger.log('isPublic',isPublic);
  if (isPublic) return next();
  return verifyToken(req, res, next)
};
app.use(withAuth);

app.use('/', gatewayRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

export default app;


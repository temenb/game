import dotenv from 'dotenv';

dotenv.config();

export const config = {
  grpcPort: process.env.GRPC_PORT || 3000,
  httpPort: process.env.HTTP_PORT || 5000,
  serviceAuthUrl: process.env.SERVICE_AUTH_URL || 'auth:3000',
  serviceProfileUrl: process.env.SERVICE_PROFILE_URL || 'profile:3000',
  serviceShipUrl: process.env.SERVICE_SHIP_URL || 'ship:3000',
  serviceAsteroidUrl: process.env.SERVICE_ASTEROID_URL || 'asteroid:3000',
  serviceEngineUrl: process.env.SERVICE_ENGINE_URL || 'engine:3000',
  serviceServerUrl: process.env.SERVICE_SERVER_URL || 'server:3000',
  rabbitHost: process.env.RABBIT_HOST || 'rabbit',
  rabbitUser: process.env.RABBIT_USER || 'user',
  rabbitPass: process.env.RABBIT_PASS || 'password',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your_access_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your_refresh_secret",
  postgresUrl: process.env.POSTGRES_URL || '',
};

export default config;

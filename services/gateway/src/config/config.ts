import dotenv from 'dotenv';

dotenv.config();

export const config = {
  grpcPort: process.env.GRPC_PORT || 50051,
  httpPort: process.env.HTTP_PORT || 9090,
  serviceAuthUrl: process.env.SERVICE_AUTH_URL || 'auth:50051',
  serviceProfileUrl: process.env.SERVICE_PROFILE_URL || 'profile:50051',
  servicePawnUrl: process.env.SERVICE_SHIP_URL || 'pawn:50051',
  serviceSpawnerUrl: process.env.SERVICE_ASTEROID_URL || 'spawner:50051',
  serviceEngineUrl: process.env.SERVICE_ENGINE_URL || 'engine:50051',
  serviceFalloutUrl: process.env.SERVICE_FALLOUT_URL || 'fallout:50051',
  rabbitHost: process.env.RABBIT_HOST || 'rabbit',
  rabbitUser: process.env.RABBIT_USER || 'user',
  rabbitPass: process.env.RABBIT_PASS || 'password',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your_access_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your_refresh_secret",
  postgresUrl: process.env.POSTGRES_URL || '',
};

export default config;

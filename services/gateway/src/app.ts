import dotenv from 'dotenv';
import httpApp from './http/server';
import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';

dotenv.config();

const GRPC_PORT = process.env.GRPC_PORT ?? '50051';
const HTTP_PORT = process.env.HTTP_PORT ?? 9090;

async function startGrpc() {
  return new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(
      `0.0.0.0:${GRPC_PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error('❌ Ошибка запуска gRPC:', err);
          return reject(err);
        }
        logger.info(`🟢 gRPC сервер запущен на порту ${port}`);
        resolve();
      }
    );
  });
}

async function startHttp() {
  return new Promise<void>((resolve) => {
    httpApp.listen(HTTP_PORT, () => {
      logger.info(`🌐 HTTP сервер запущен на порту ${HTTP_PORT}`);
      resolve();
    });
  });
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc(), startHttp()]);
    logger.info('🚀 Gateway успешно запущен: gRPC + HTTP');
  } catch (err) {
    logger.error('💥 Ошибка запуска Gateway:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Завершение работы...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();

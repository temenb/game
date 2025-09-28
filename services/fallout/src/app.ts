import dotenv from 'dotenv';
import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';

dotenv.config();

const GRPC_PORT = process.env.GRPC_PORT ?? '3000';

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
        grpcServer.start();
        logger.info(`🟢 gRPC сервер запущен на порту ${port}`);
        resolve();
      }
    );
  });
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc()]);
    logger.info('🚀 Auth успешно запущен: gRPC');
  } catch (err) {
    logger.error('💥 Ошибка запуска Auth:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Завершение работы...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();

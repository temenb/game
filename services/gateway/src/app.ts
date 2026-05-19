import httpApp from './http/server';
import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import config from "./config/config";


async function startGrpc() {
  return new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(
      `0.0.0.0:${config.grpcPort}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error('❌ Ошибка запуска gRPC:', err);
          reject(err);
          return;
        }
        logger.info(`🟢 gRPC сервер запущен на порту ${port}`);
        resolve();
      }
    );

    process.on('SIGINT', () => {
      logger.info('🛑 Остановка gRPC сервера...');
      grpcServer.forceShutdown();
      process.exit(0);
    });
  });
}

async function startHttp() {
  return new Promise<void>((resolve) => {
    httpApp.listen(config.httpPort, "0.0.0.0", () => {
      logger.info(`🌐 HTTP сервер запущен на порту ${config.httpPort}`);
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


import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import {initBoss, startWorker} from "@shared/pg-boss";
import {kafkaConfig, kafkaProducersConfig} from "./config/kafka.config";

const GRPC_PORT = process.env.GRPC_PORT ?? '50051';

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

// async function startPgBoss() {
//   const configs = Object.values(kafkaProducersConfig);
//
//   logger.log(configs);
//   // startWorker(kafkaConfig, 'battle.makeMove');
//   startWorker(kafkaConfig, 'battle.new');
//   return Promise.resolve(0);
//   // return Promise.all(
//   //   configs.map(async (topicConfig) => {
//   //     logger.log('init - ' + topicConfig);
//   //
//   //     await initBoss(async () => {
//   //       logger.log('init - ' + topicConfig + '!!');
//   //
//   //       await startWorker(kafkaConfig, topicConfig);
//   //     });
//   //   })
//   // );
// }

async function startPgBoss() {
  await initBoss(async () => {
    for (const topicConfig in kafkaProducersConfig) {
      await startWorker(kafkaConfig, topicConfig);
    }
  });
}


async function bootstrap() {
  try {
    await Promise.all([startGrpc(), startPgBoss()]);
    logger.info('🚀 Engine успешно запущен: gRPC');
  } catch (err) {
    logger.error('💥 Ошибка запуска Engine:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Завершение работы...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();

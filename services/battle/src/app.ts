import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import kafkaConfig, {kafkaConsumersConfig, kafkaProducersConfig} from "./config/kafka.config";
import {createConsumer} from '@shared/kafka';
// import {startBattleNewWorker} from "./lib/consumers";
import {initBoss, startWorker} from "@shared/pg-boss";

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

async function startPgBoss() {
  await initBoss(async () => {
    for (const topicConfig of Object.values(kafkaProducersConfig)) {
      await startWorker(kafkaConfig, topicConfig);
    }
  });
}

async function createKafkaConsumers() {
  const configs = Object.values(kafkaConsumersConfig);

  await Promise.all(
    configs.map(async ({ topic, handler }) => {
      await createConsumer(kafkaConfig, { topic, handler });
    })
  );
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc(), startPgBoss(), createKafkaConsumers()]);
  } catch (err) {
    logger.error('💥 Ошибка запуска Battle:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Завершение работы...');
    grpcServer.forceShutdown();
    process.exit(0);
  });

}

bootstrap();




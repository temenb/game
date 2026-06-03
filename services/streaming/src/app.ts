import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import {createConsumer} from "@shared/kafka";
import kafkaConfig, {kafkaConsumersConfig} from "./config/kafka.config";
import {initWss} from "./websocket/server";
import config from "./config/config";
import {WebSocketServer} from "ws";


const GRPC_PORT = Number(config.grpcPort);

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

async function createKafkaConsumers() {
  const configs = Object.values(kafkaConsumersConfig);

  await Promise.all(
    configs.map(async ({ topic, handler }) => {
      await createConsumer(kafkaConfig, { topic, handler });
    })
  );
}

async function startWebSocket() {
  return new Promise<void>(() => {
    initWss();
  });
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc(), createKafkaConsumers(), startWebSocket()]);
    logger.info('🚀 Streaming успешно запущен');
  } catch (err) {
    logger.error('💥 Ошибка запуска Streaming:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Завершение работы...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();



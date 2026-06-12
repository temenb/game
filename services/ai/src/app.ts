import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import config from "./config/config";
import {createConsumer} from "@shared/kafka";
import kafkaConfig, {kafkaConsumersConfig} from "./config/kafka.config";
import {getWebSoket} from "./services/ai.service";


async function startGrpc() {
  return new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(
      `0.0.0.0:${config.grpcPort}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error('❌ Failed to start gRPC:', err);
          reject(err);
          return;
        }
        logger.info(`🟢 gRPC server started on port ${port}`);
        resolve();
      }
    );

    process.on('SIGINT', () => {
      logger.info('🛑 Stopping gRPC server...');
      grpcServer.forceShutdown();
      process.exit(0);
    });
  });
}

async function createKafkaConsumers() {
  const configs = Object.values(kafkaConsumersConfig);

  await Promise.all(
    configs.map(async ({topic, handler}) => {
      await createConsumer(kafkaConfig, {topic, handler});
    })
  );
}

async function createWebSocketStream() {
  return new Promise<void>(async (resolve, reject) => {
    await getWebSoket();
  });
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc(), createKafkaConsumers(), createWebSocketStream()]);
    logger.info('🚀 Ai successfully started ');
  } catch (err) {
    logger.error('💥 Failed to start Ai:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Shutting down...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();


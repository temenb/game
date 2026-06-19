import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import config from "./config/config";
import {createConsumer} from "@shared/kafka";
import kafkaConfig, {kafkaConsumersConfig} from "./config/kafka.config";
import battleClient from "./clients/battle.client";
import {initBoss, startKafkaWorker, startWorker} from "@shared/pg-boss";
import pgBossConfig, {pgBossConsumersConfig} from "./config/pg.boss.config";


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
  return await battleClient.connect();
}

async function startPgBoss() {
  await initBoss(pgBossConfig, async () => {
    for (const topicConfig of Object.values(pgBossConsumersConfig)) {
      // lo
      await startWorker(topicConfig.topic, topicConfig.handler);
    }
  });
}


async function bootstrap() {
  try {
    await Promise.all([startGrpc(), startPgBoss(), createKafkaConsumers(), createWebSocketStream()]);
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




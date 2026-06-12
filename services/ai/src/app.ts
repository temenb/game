import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import config from "./config/config";
import {initBoss, startWorker} from "@shared/pg-boss";


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

async function startPgBoss() {
  await initBoss(pgBossConfig, async () => {
    for (const topicConfig of Object.values(kafkaProducersConfig)) {
      await startWorker(kafkaConfig, topicConfig);
    }
  });
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc(), startPgBoss()]);
    logger.info('🚀 AI successfully started ');
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


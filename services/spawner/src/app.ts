import dotenv from 'dotenv';
import { SpawnService } from './generated/spawn';
import * as grpc from '@grpc/grpc-js';
import * as spawnHandler from "./grpc/handlers/spawn.handler";
import kafkaConfig, {createProfileConsumerConfig} from "./config/kafka.config";
import { createConsumer } from '@shared/kafka';
import {profileCreated} from "./utils/consumers";

dotenv.config();

const server = new grpc.Server();

server.addService(SpawnService, {
    // register: spawnHandler.register,
    // login: spawnHandler.login,
    // refreshTokens: spawnHandler.refreshTokens,
    // logout: spawnHandler.logout,
    // forgotPassword: spawnHandler.forgotPassword,
    // resetPassword: spawnHandler.resetPassword,
  health: spawnHandler.health,
  status: spawnHandler.status,
  livez: spawnHandler.livez,
  readyz: spawnHandler.readyz,
});

createConsumer(kafkaConfig, {
  ...createProfileConsumerConfig,
  handler: profileCreated,
});

export default server;


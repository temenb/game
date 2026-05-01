import {SpawnerService} from './generated/spawner';
import * as grpc from '@grpc/grpc-js';
import * as spawnerHandler from "./grpc/handlers/spawner.handler";
import kafkaConfig, {createProfileConsumerConfig} from "./config/kafka.config";
import {createConsumer} from '@shared/kafka';
import {profileCreated} from "./lib/consumers";

const server = new grpc.Server();

server.addService(SpawnerService, {
  // register: spawnerHandler.register,
  // login: spawnerHandler.login,
  // refreshTokens: spawnerHandler.refreshTokens,
  // logout: spawnerHandler.logout,
  // forgotPassword: spawnerHandler.forgotPassword,
  // resetPassword: spawnerHandler.resetPassword,
  health: spawnerHandler.health,
  status: spawnerHandler.status,
  livez: spawnerHandler.livez,
  readyz: spawnerHandler.readyz,
});

createConsumer(kafkaConfig, {
  ...createProfileConsumerConfig,
  handler: profileCreated,
});

export default server;


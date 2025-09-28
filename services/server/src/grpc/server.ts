import dotenv from 'dotenv';
import {ServerService} from './generated/server';
import * as grpc from '@grpc/grpc-js';
import * as healthHandler from "./handlers/health.handler";

dotenv.config();

const server = new grpc.Server();

server.addService(ServerService, {
  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
});

export default server;


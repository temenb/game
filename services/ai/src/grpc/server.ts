import {AiService} from './generated/ai';
import * as grpc from '@grpc/grpc-js';
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(AiService, {
  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
});

export default server;


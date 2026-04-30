import {OrchestrationService} from './generated/orchestration';
import * as grpc from '@grpc/grpc-js';
import * as healthHandler from "./handlers/health.handler";
import * as orchestrationHandler from "./handlers/orchestration.handler";

const server = new grpc.Server();

server.addService(OrchestrationService, {
  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
  viewMyProfile: orchestrationHandler.viewMyProfile,
});

export default server;


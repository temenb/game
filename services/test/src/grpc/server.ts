import {TestService} from './generated/test';
import * as grpc from '@grpc/grpc-js';
import * as healthHandler from "./handlers/health.handler";
import * as testHandler from "./handlers/test.handler";

const server = new grpc.Server();

server.addService(TestService, {
  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
  // getMyProfile: testHandler.getMyProfile,
});

export default server;


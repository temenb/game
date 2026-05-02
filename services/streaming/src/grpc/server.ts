import {StreamingService} from './generated/streaming';
import * as grpc from '@grpc/grpc-js';
import * as streamingHandler from "./handlers/streaming.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(StreamingService, {

  anonymousSignIn: streamingHandler.anonymousSignIn,
  viewMyProfile: streamingHandler.viewMyProfile,
  refreshTokens: streamingHandler.refreshTokens,
  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
});

export default server;


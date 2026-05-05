import {StreamingService} from './generated/streaming';
import * as grpc from '@grpc/grpc-js';
// import * as BattleHandler from "./handlers/battle.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(StreamingService, {

  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,

  // getBattle: battleHandler
});

export default server;

import {StreamingService} from './generated/streaming';
import * as grpc from '@grpc/grpc-js';
import * as profileHandler from "./handlers/profile.handler";
import * as battleHandler from "./handlers/battle.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(StreamingService, {

  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,

  getMyProfile: profileHandler.getMyProfile,

  // getBattle: battleHandler.getBattle,
  battleChannel: battleHandler.battleChannel,
});

export default server;


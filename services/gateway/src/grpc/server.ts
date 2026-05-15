import {GatewayService} from './generated/gateway';
import * as grpc from '@grpc/grpc-js';
import * as gatewayHandler from "./handlers/gateway.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(GatewayService, {

  anonymousSignIn: gatewayHandler.anonymousSignIn,
  refreshTokens: gatewayHandler.refreshTokens,

  getMyProfile: gatewayHandler.getMyProfile,

  newBattle: gatewayHandler.newBattle,
  makeMove: gatewayHandler.makeMove,

  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
});

export default server;


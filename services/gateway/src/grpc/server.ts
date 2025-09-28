import dotenv from 'dotenv';
import {GatewayService} from './generated/gateway';
import * as grpc from '@grpc/grpc-js';
import * as gatewayHandler from "./handlers/gateway.handler";
import * as healthHandler from "./handlers/health.handler";

dotenv.config();

const server = new grpc.Server();

server.addService(GatewayService, {

  anonymousSignIn: gatewayHandler.anonymousSignIn,
  viewProfile: gatewayHandler.viewProfile,
  // health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
});

export default server;

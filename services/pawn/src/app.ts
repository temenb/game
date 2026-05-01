import {PawnService} from './generated/pawn';
import * as grpc from '@grpc/grpc-js';
import * as pawnHandler from "./grpc/handlers/pawn.handler";

const server = new grpc.Server();

server.addService(PawnService, {
  health: pawnHandler.health,
  status: pawnHandler.status,
  livez: pawnHandler.livez,
  readyz: pawnHandler.readyz,
});

export default server;

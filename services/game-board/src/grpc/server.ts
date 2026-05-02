import {GameBoardService} from './generated/gameBoard';
import * as grpc from '@grpc/grpc-js';
import * as gameBoardHandler from "./handlers/gameBoard.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(GameBoardService, {
  upsert: gameBoardHandler.upsert,
  viewGameBoardByUser: gameBoardHandler.viewGameBoardByUser,

  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
});

export default server;


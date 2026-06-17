import * as streamingGrpc from "../grpc/generated/streaming";
import * as battleGrpc from "../grpc/generated/battle";
import battleClient from "../clients/battle.client";
import logger from "@shared/logger";

export const connectToBattle = async (req: battleGrpc.JoinBattleRequest) => {
  battleClient.start(req);
};

export const battleMessageHandler = (message: streamingGrpc.BattleStreamResponse) => {
  if (message.battle) {
    battleClient.makeMove(message.battle.id);
  }

  if (message.error) {
    logger.error(message.error);
  }
};

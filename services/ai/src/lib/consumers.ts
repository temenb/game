import {connectToBattle} from "../services/battle.service";
import logger from "@shared/logger";
import * as streamingGrpc from "../grpc/generated/streaming";

export async function connectingRequest(topic: string, partition: number, message: streamingGrpc.JoinBattleRequest): Promise<void> {
  try {
    logger.log('message received', message);
    connectToBattle(message);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message.battleId,
      error,
    });
  }
}

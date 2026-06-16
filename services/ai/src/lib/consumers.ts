import {connectToBattle} from "../services/ai.service";
import logger from "@shared/logger";
import * as battleGrpc from "../grpc/generated/battle";

export async function connectingRequest(topic: string, partition: number, message: battleGrpc.JoinBattleRequest): Promise<void> {
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

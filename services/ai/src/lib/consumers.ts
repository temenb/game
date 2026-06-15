import {connectToBattle} from "../services/ai.service";
import logger from "@shared/logger";
import * as aiGrpc from "../grpc/generated/ai";

export async function connectingRequest(topic: string, partition: number, message: aiGrpc.ConnectingRequest): Promise<void> {
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

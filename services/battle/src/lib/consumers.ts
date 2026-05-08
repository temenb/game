// import {upsertBattle} from "../services/battle.service";
import logger from "@shared/logger";
import {createBattle, updateBattle} from "../services/battle.service";

export async function battleCreated(message: any): Promise<void> {
  try {
    await createBattle(message.userId);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message.userId,
      error,
    });
  }
}

export async function battleUpdated(message: any): Promise<void> {
  try {
    await updateBattle(message.userId);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message.userId,
      error,
    });
  }
}

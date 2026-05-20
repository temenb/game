import logger from "@shared/logger";
import {updateBattle} from "../services/battle.service";


export async function battleUpdated(message: any): Promise<void> {
  try {
    logger.log('battleUpdated');
    logger.log(message);
    await updateBattle(message.userId);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message.userId,
      error,
    });
  }
}

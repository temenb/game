import logger from "@shared/logger";
import {updateBattle} from "../services/battle.service";
import {BattleObject} from "../grpc/generated/battle";


export async function battleUpdated(message: BattleObject): Promise<void> {
  try {
    logger.log('battleUpdated');
    logger.log(message);
    await updateBattle(message);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message,
      error,
    });
  }
}

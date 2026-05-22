import * as BattleService from "../services/battle.service";
import logger from "@shared/logger";

export async function battleStarted(topic: string, partition: number, message: any): Promise<void> {
    try {
      await BattleService.battleNew(message.id, message.players);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: message,
        error,
      });
    }
}


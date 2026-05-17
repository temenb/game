import * as BattleService from "../services/battle.service";
import logger from "@shared/logger";

export async function battleNew(messages: any): Promise<void> {
  console.log('message=', messages);
  for (const raw of messages) {
    try {
      const payload = JSON.parse(raw.value);
      await BattleService.battleNew(payload.id, payload.players);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: raw.value,
        error,
      });
    }
  }
}


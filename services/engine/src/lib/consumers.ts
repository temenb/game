import * as BattleService from "../services/battle.service";
import logger from "@shared/logger";
import {BattleObject} from "../grpc/generated/battle";

export async function battleStarted(topic: string, partition: number, message: any): Promise<void> {
    try {
      await BattleService.battleNew(message as BattleObject);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: message,
        error,
      });
    }
}


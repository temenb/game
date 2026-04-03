import {upsertSpawn} from "../services/spawn.service";
import logger from "@shared/logger";

export async function profileCreated(messages: any): Promise<void> {
  console.log('message=', messages);
  for (const raw of messages) {
    try {
      const payload = JSON.parse(raw.value);
      await upsertSpawn(payload.ownerId);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: raw.value,
        error,
      });
    }
  }
}

import {pawnCreated, spawnerCreated, portaCreated} from "../services/engine.service";
import logger from "@shared/logger";

export async function spawnerCreated(messages: any): Promise<void> {
  console.log('message=', messages);
  for (const raw of messages) {
    try {
      const payload = JSON.parse(raw.value);
      await upsertSpawner(payload.ownerId);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: raw.value,
        error,
      });
    }
  }
}

export async function pawnCreated(messages: any): Promise<void> {
  console.log('message=', messages);
  for (const raw of messages) {
    try {
      const payload = JSON.parse(raw.value);
      await upsertSpawner(payload.ownerId);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: raw.value,
        error,
      });
    }
  }
}

export async function portalCreated(messages: any): Promise<void> {
  console.log('message=', messages);
  for (const raw of messages) {
    try {
      const payload = JSON.parse(raw.value);
      await upsertSpawner(payload.ownerId);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: raw.value,
        error,
      });
    }
  }
}

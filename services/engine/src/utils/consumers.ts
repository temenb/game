import {shipCreated, asteroidCreated, portaCreated} from "../services/engine.service";
import logger from "@shared/logger";

export async function asteroidCreated(messages: any): Promise<void> {
  console.log('message=', messages);
  for (const raw of messages) {
    try {
      const payload = JSON.parse(raw.value);
      await upsertAsteroid(payload.ownerId);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: raw.value,
        error,
      });
    }
  }
}

export async function shipCreated(messages: any): Promise<void> {
  console.log('message=', messages);
  for (const raw of messages) {
    try {
      const payload = JSON.parse(raw.value);
      await upsertAsteroid(payload.ownerId);
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
      await upsertAsteroid(payload.ownerId);
    } catch (error) {
      logger.error(`[Kafka] Failed to process message`, {
        rawValue: raw.value,
        error,
      });
    }
  }
}

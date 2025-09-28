import config from "../config/config";
// import {upsertProfile} from "../services/profile.service";
import logger from '@shared/logger';

export async function initConsumers() {
  // await consumeEvent(config.kafkaTopicUserCreated, async ({topic, partition, message}): Promise<void> => {
  //   try {
  //     const rawValue = message.value?.toString();
  //     if (!rawValue) {
  //       logger.warn(`[Kafka] Empty message on topic=${topic}, partition=${partition}`);
  //       return;
  //     }
  //
  //     const payload = JSON.parse(rawValue);
  //     logger.log(`[Kafka] Message consumed`, {
  //       topic,
  //       partition,
  //       offset: message.offset,
  //       payload,
  //     });
  //
  //     const profile = await upsertProfile(payload.ownerId);
  //     logger.log(`[${topic}] Processed ownerId=${payload.ownerId}`);
  //     logger.log(`[Profile service] Profile ${profile.id} created`);
  //
  //     // Здесь можно добавить бизнес-логику обработки payload
  //   } catch (error) {
  //     logger.error(`[Kafka] Failed to process message`, {
  //       topic,
  //       partition,
  //       offset: message.offset,
  //       error,
  //     });
  //   }
  // });
}

export default initConsumers;

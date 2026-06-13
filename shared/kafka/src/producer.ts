import { getKafkaInstance } from './register';
import { KafkaConfig } from './types';
import { Partitioners, KafkaJSProtocolError } from "kafkajs";
import logger from "@shared/logger";

export async function createProducer(config: KafkaConfig) {
  const kafka = await getKafkaInstance(config);
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();

  // проверка и создание топика
  const admin = kafka.admin();
  try {
    await admin.connect();
    await admin.createTopics({
      topics: [{ topic: "battle-stream", numPartitions: 1, replicationFactor: 1 }],
      waitForLeaders: true,
    });
    // logger.info("✅ Topic ensured for producer");
  } catch (err) {
    if (err instanceof KafkaJSProtocolError && err.type === "UNKNOWN_TOPIC_OR_PARTITION") {
      logger.warn("⚠️ Topic not found, will retry...");
    } else {
      logger.error("❌ Kafka admin error:", err);
    }
  } finally {
    await admin.disconnect();
  }

  return {
    send: async (topic: string, message: any) => {
      try {
        await producer.send({
          topic,
          messages: [{ value: JSON.stringify(message) }],
        });
      } catch (err) {
        logger.error(`❌ Failed to send to ${topic}:`, err);
        // можно добавить реконнект
        await producer.disconnect();
        await producer.connect();
      }
    },
    disconnect: async () => await producer.disconnect(),
  };
}

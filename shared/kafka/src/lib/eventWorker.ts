import { boss } from '@shared/pg-boss';
import {createProducer, KafkaConfig} from '@shared/kafka';
import logger from "@shared/logger";

export async function startKafkaEventWorker(kafkaConfig: KafkaConfig) {
  const producer = await createProducer(kafkaConfig);

  await boss().work('event.kafka*', async job => {
    try {
      const { name, data } = job;
      const topic = name.replace('event.', '');

      await producer.send(
        topic,
        [{ value: JSON.stringify(data) }]
      );
      logger.log('Kafka event worker started');

      return true;
    } catch (err) {
      logger.error('Kafka send failed:', err);
      throw err;
    }
  });
}

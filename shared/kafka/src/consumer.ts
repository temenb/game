import { getKafkaInstance } from './register';
import { KafkaConfig, ConsumerConfig } from './types';

export async function createConsumer(config: KafkaConfig, consumerConfig: ConsumerConfig) {
  const kafka = getKafkaInstance(config);
  const consumer = kafka.consumer({ groupId: consumerConfig.groupId });

  await consumer.connect();
  await consumer.subscribe({ topic: consumerConfig.topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value?.toString();
      if (value) {
        await consumerConfig.handler(JSON.parse(value));
      }
    },
  });

  return consumer;
}

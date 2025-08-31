import { getKafkaInstance } from './register';
import { KafkaConfig, ConsumerConfig } from './types';
import { KafkaJSProtocolError } from 'kafkajs';

export async function createConsumer(config: KafkaConfig, consumerConfig: ConsumerConfig) {
  const kafka = getKafkaInstance(config);
  const admin = kafka.admin();
  const consumer = kafka.consumer({ groupId: consumerConfig.groupId });

  await admin.connect();

  // Проверка существования топика
  const metadata = await admin.fetchTopicMetadata();
  const topicExists = metadata.topics.some(t => t.name === consumerConfig.topic);

  if (!topicExists) {
    await admin.createTopics({
      topics: [{ topic: consumerConfig.topic, numPartitions: 1 }],
      waitForLeaders: true,
    });
  }

  await admin.disconnect();

  await consumer.connect();

  // Подписка с retry на случай гонки
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await consumer.subscribe({ topic: consumerConfig.topic, fromBeginning: true });
      break;
    } catch (err) {
      if (
        err instanceof KafkaJSProtocolError &&
        err.message.includes('does not host this topic-partition')
      ) {
        await new Promise(res => setTimeout(res, 1000));
        continue;
      }
      throw err;
    }
  }

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

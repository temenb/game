import { Kafka, EachMessagePayload, Consumer } from 'kafkajs';
import { getKafkaInstance } from './registry';

const consumerMap: Map<string, Consumer> = new Map();

export async function consumeEvent(
  topic: string,
  handler: (payload: EachMessagePayload) => Promise<void>,
  groupId: string
) {
  let consumer = consumerMap.get(groupId);
  if (!consumer) {
    const kafka = getKafkaInstance(groupId);
    consumer = kafka.consumer({ groupId });
    await consumer.connect();
    consumerMap.set(groupId, consumer);
  }

  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({ eachMessage: handler });
}

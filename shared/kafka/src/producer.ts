import { getKafkaInstance } from './register';
import { KafkaConfig } from './types';
import {Partitioners} from "kafkajs";

export async function createProducer(config: KafkaConfig) {
  const kafka = getKafkaInstance(config);
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();

  return {
    send: async (topic: string, message: any) => {
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    },
    disconnect: async () => await producer.disconnect(),
  };
}

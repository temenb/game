import { getKafkaInstance } from './register';
import { KafkaConfig, ProducerConfig } from './types';

export async function createProducer(config: KafkaConfig) {
  const kafka = getKafkaInstance(config);
  const producer = kafka.producer();
  await producer.connect();

  return {
    send: async ({ topic }: ProducerConfig, message: any) => {
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    },
    disconnect: async () => await producer.disconnect(),
  };
}

import { Kafka } from 'kafkajs';
import { KafkaConfig } from './types';

const kafkaMap = new Map<string, Kafka>();

export function getKafkaInstance(config: KafkaConfig): Kafka {
  const { clientId, brokers } = config;
  if (!kafkaMap.has(clientId)) {
    const brokerList = brokers.split(',').map(b => b.trim());
    const kafka = new Kafka({
      clientId,
      brokers: brokerList,
      retry: {
        retries: 5,
        initialRetryTime: 300,
      },
      requestTimeout: 3000,
    });


    kafkaMap.set(clientId, kafka);
  }
  return kafkaMap.get(clientId)!;
}

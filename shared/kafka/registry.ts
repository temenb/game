import { Kafka } from 'kafkajs';
import config from '../config';

const kafkaMap: Map<string, Kafka> = new Map();

export function getKafkaInstance(clientId: string): Kafka {
  if (!kafkaMap.has(clientId)) {
    const brokers = config.kafkaBrokers?.split(',') ?? ['localhost:9092'];
    const kafka = new Kafka({ clientId, brokers });
    kafkaMap.set(clientId, kafka);
  }
  return kafkaMap.get(clientId)!;
}

import { Kafka, Partitioners, Producer } from 'kafkajs';
import { getKafkaInstance } from './registry';

let producer: Producer;

export async function initProducer(clientId: string) {
  const kafka = getKafkaInstance(clientId);
  producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
  await producer.connect();
  return producer;
}

export function getProducer(): Producer {
  if (!producer) throw new Error('Kafka producer not initialized');
  return producer;
}

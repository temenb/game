import {Kafka, ProducerRecord, EachMessagePayload, Partitioners, Admin} from 'kafkajs';
import config from '../config/config'
import logger from "@shared/logger";

let producer: ReturnType<Kafka['producer']>;
let consumer: ReturnType<Kafka['consumer']>;
let kafka: Kafka;
let admin: Admin;

export async function initKafka(clientId: string) {
  const brokers = config.kafkaBrokers?.split(',');

  kafka = new Kafka({
    clientId,
    brokers,
    retry: {
      retries: 5,
      initialRetryTime: 300,
    },
    requestTimeout: 3000,
  });

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();
  admin = kafka.admin();
  await admin.connect()
}

export async function broadcastEvent(topic: string, messages: ProducerRecord['messages']) {
  if (!producer) throw new Error('Kafka producer not initialized');
  await producer.send({ topic, messages });
}


export async function ensureTopic(topic: string) {
  const topics = await admin.listTopics()
  if (!topics.includes(topic)) {
    await admin.createTopics({
      topics: [{ topic, numPartitions: 1, replicationFactor: 1 }]
    })
    console.log(`✅ Created topic: ${topic}`)
  }
  await admin.disconnect()
}

export async function consumeEvent(
  topic: string,
  handler: (payload: EachMessagePayload) => Promise<void>,
  groupId: string = 'default-group'
) {
  consumer = kafka.consumer({ groupId });
  await consumer.connect();

  logger.log('herere', topic, groupId);

  if (!consumer) throw new Error('Kafka consumer not initialized');
  await ensureTopic(topic)
  await consumer.subscribe({topic, fromBeginning: true});
  await consumer.run({eachMessage: handler});
}



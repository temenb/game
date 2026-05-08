import logger from '@shared/logger';
import {createProducer, KafkaConfig} from "@shared/kafka";
import {Job} from 'pg-boss';

const { PgBoss } = require('pg-boss');
export const pgBossKafkaEventPrefix = 'event.';

let _boss: typeof PgBoss | null = null;

export async function initBoss(cb: () => void): Promise<typeof PgBoss> {
  if (!_boss) {
    _boss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
    }) as typeof PgBoss;

    // logger.log(process.env.DATABASE_URL);

    await _boss.start();

    cb();
    console.log('PgBoss started');
  }

  return _boss!;
}

export function boss(): typeof PgBoss {
  if (!_boss) {
    throw new Error('Boss has not been initialized. Call createBoss() first.');
  }
  return _boss!;
}

export async function startWorker(kafkaConfig: KafkaConfig, topic: string) {
  const producer = await createProducer(kafkaConfig);

  await boss().createQueue(pgBossKafkaEventPrefix + topic);


  logger.log('startWorker ' + pgBossKafkaEventPrefix);
  logger.log('startWorker ' + pgBossKafkaEventPrefix + topic);
  await boss().work(pgBossKafkaEventPrefix + topic, async (job: Job) => {
    try {

      const j = Array.isArray(job) ? job[0] : job;
      const {name, data} = j;

      const topic = name.replace('event.', '');

      await producer.send(topic, data);
      logger.log('pgBoss ' + topic + ' event successfully done');

      return true;
    } catch (err) {
      logger.error('Kafka send failed:', err);
      throw err;
    }
  });
  logger.log('Kafka ' + topic + ' event worker started');
}


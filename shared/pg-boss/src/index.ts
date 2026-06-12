import logger from '@shared/logger';
import {createProducer, KafkaConfig} from "@shared/kafka";
import {Job} from 'pg-boss';
import {PgBossConfig} from "@shared/pg-boss/src/types";

const { PgBoss } = require('pg-boss');
export const pgBossKafkaEventPrefix = 'event.';

let _boss: typeof PgBoss | null = null;

export async function initBoss(pbBossConfig: PgBossConfig, cb: () => void): Promise<typeof PgBoss> {
  // logger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!boss');
  // logger.log(_boss);
  if (!_boss) {

    try {
      // logger.log('1');

      _boss = new PgBoss({
        connectionString: process.env.DATABASE_URL,
        max: pbBossConfig.max || 5,
        newConnectionTimeoutSeconds: pbBossConfig.newConnectionTimeoutSeconds || 30,
        maintenanceIntervalSeconds: pbBossConfig.maintenanceIntervalSeconds || 60,
        applicationName: pbBossConfig.applicationName || 'pgboss',
      }) as typeof PgBoss;

      // logger.log(process.env.DATABASE_URL);
      // logger.log('2');

      await _boss.start();

      // logger.log('3');

      cb();
      // logger.log(_boss);
    } catch (e) {
      logger.log(e);
    }
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

  // logger.log('startWorker ' + pgBossKafkaEventPrefix + topic);
  await boss().work(pgBossKafkaEventPrefix + topic, async (job: Job) => {
    try {

      const j = Array.isArray(job) ? job[0] : job;
      const {name, data} = j;

      const topic = name.replace(pgBossKafkaEventPrefix, '');

      await producer.send(topic, data);
      // logger.log('pgBoss ' + topic + ' event successfully done');

      return true;
    } catch (err) {
      logger.error('Kafka send failed:', err);
      throw err;
    }
  });
  logger.log('Kafka ' + pgBossKafkaEventPrefix + topic + ' event worker started');
}


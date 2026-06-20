import logger from '@shared/logger';
import {createProducer, KafkaConfig} from "@shared/kafka";
import {Job} from 'pg-boss';
import {PgBossConfig} from "@shared/pg-boss/src/types";

const { PgBoss } = require('pg-boss');

let _boss: typeof PgBoss | null = null;

export async function initBoss(pbBossConfig: PgBossConfig, cb: () => void): Promise<typeof PgBoss> {
  if (_boss) return _boss;

  // logger.log('init');
  async function tryStart(attempt = 1): Promise<typeof PgBoss> {
    // logger.log('try to start pgboss');
    // logger.log(process.env.DATABASE_URL);

    try {
      _boss = new PgBoss({
        connectionString: process.env.DATABASE_URL,
        max: pbBossConfig.max || 5,
        newConnectionTimeoutSeconds: pbBossConfig.newConnectionTimeoutSeconds || 30,
        maintenanceIntervalSeconds: pbBossConfig.maintenanceIntervalSeconds || 60,
        applicationName: pbBossConfig.applicationName || 'pgboss',
      }) as typeof PgBoss;

      try {
        await _boss.start();
        logger.info("✅ PgBoss started");
      } catch (e) {
        console.error(e);
      }

      cb();

      _boss.on("error", (err: any) => {
        logger.error("⚠️ PgBoss error:", err);
        _boss = null;
        const delay = Math.min(1000 * 2 ** attempt, 30000);
        setTimeout(() => tryStart(attempt + 1), delay);
      });

      attempt = 1;
      return _boss!;
    } catch (e) {
      logger.error("❌ PgBoss start failed:", e);
      _boss = null;
      const delay = Math.min(1000 * 2 ** attempt, 30000);
      logger.info(`🔄 Retry PgBoss start in ${delay / 1000}s (attempt ${attempt})`);
      setTimeout(() => tryStart(attempt + 1), delay);
    }
  }

  return await tryStart();
}


export function boss(): typeof PgBoss {
  if (!_boss) {
    throw new Error('Boss has not been initialized. Call createBoss() first.');
  }
  return _boss!;
}


export async function startKafkaWorker(kafkaConfig: KafkaConfig, topic: string) {
  // проверка на дубль

  // logger.log('===========================================================================')
  const producer = await createProducer(kafkaConfig);
  await boss().createQueue(topic);

  await boss().work(topic, async (job: Job) => {
    try {
      const j = Array.isArray(job) ? job[0] : job;
      const { name, data } = j;
      const topicName = name;
      await producer.send(topicName, data);
      return true;
    } catch (err) {
      logger.error('Kafka send failed:', err);
      throw err;
    }
  });

  logger.log('Kafka ' + topic + ' event worker started');
}

export async function startWorker(topic: string, handler: (jobs: Job[]) => Promise<void>) {
  // проверка на дубль
  // logger.log('===========================================================================22')

  await boss().createQueue(topic);

  await boss().work(topic, handler);

  logger.log(topic + ' event worker started');
}


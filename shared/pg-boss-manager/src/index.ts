import logger from '@shared/logger';
import { createProducer, KafkaConfig } from '@shared/kafka-manager';
import { Job, PgBoss } from 'pg-boss';
import { PgBossConfig } from './types';



export class PgBossManager {

  private _boss: PgBoss | null = null;

  private workers: Array<() => Promise<void>> = [];
  private workersStarted = false;

  initBoss = (
    config: PgBossConfig,
    cb: () => void
  ): Promise<PgBoss> => {

    return (async () => {
      const boss = new PgBoss({
        connectionString: process.env.DATABASE_URL,
        max: config.max ?? 5,
        maintenanceIntervalSeconds: config.maintenanceIntervalSeconds ?? 60,
        application_name: config.applicationName ?? 'pgboss',
      });

      await boss.start();

      this._boss = boss;

      logger.info('✅ PgBoss connected');

      cb();

      return boss;
    })();

  };

  boss = async (): Promise<PgBoss> => {
    if (!this._boss) {
      throw new Error('PgBoss not initialized');
    }
    return this._boss;
  };


  stopBoss = async() => {
    if (!this._boss) return;

    try {
      await this._boss.stop();
      logger.info('🛑 PgBoss stopped');
    } catch (e) {
      logger.error('PgBoss stop error', e);
    } finally {
      this._boss = null;
      // workersStarted = false;
    }
  }

  /**
   * GENERIC WORKER
   */
  startWorker = async (
    topic: string,
    handler: (jobs: Job[]) => Promise<void>
  ) => {
    const register = async () => {
      const boss = await this.boss();

      await boss.createQueue(topic);

      await boss.work(topic, handler);

      logger.info(`📦 Worker started: ${topic}`);
    };

    this.workers.push(register);

    if (this._boss) {
      await register();
    }
  }

  /**
   * KAFKA WORKER (batch-safe)
   */
  startKafkaWorker = async (
    kafkaConfig: KafkaConfig,
    topic: string
  ) => {
    const register = async () => {
      const producer = await createProducer(kafkaConfig);
      const b = await this.boss();

      await b.createQueue(topic);

      await b.work(
        topic,
        { batchSize: 10 },
        async (jobs: Job<unknown>[]) => {
          for (const j of jobs) {
            await producer.send(j.name, j.data);
          }
          return true;
        }
      );

      logger.info(`Kafka worker started: ${topic}`);
    };

    this.workers.push(register);

    if (this._boss) {
      await register();
    }
  }
}

const pgBossManager = new PgBossManager();

export default pgBossManager;


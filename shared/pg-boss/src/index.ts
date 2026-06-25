import logger from '@shared/logger';
import { createProducer, KafkaConfig } from '@shared/kafka';
import { Job } from 'pg-boss';
import { PgBossConfig } from '@shared/pg-boss/src/types';

const { PgBoss } = require('pg-boss');

let _boss: any = null;
let starting = false;
let reconnectTimer: NodeJS.Timeout | null = null;

const workers: Array<() => Promise<void>> = [];

export function bossSafe() {
  return _boss;
}

async function scheduleReconnect(config: PgBossConfig, cb: () => void) {
  if (starting || reconnectTimer) {
    return;
  }

  const delay = 5000;

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;

    try {
      await initBoss(config, cb);
    } catch (e) {
      logger.error('Reconnect failed', e);
      scheduleReconnect(config, cb);
    }
  }, delay);
}

async function registerWorkers() {
  for (const worker of workers) {
    try {
      await worker();
    } catch (e) {
      logger.error('Worker restore failed', e);
    }
  }
}

export async function stopBoss() {
  if (!_boss) {
    return;
  }

  try {
    await _boss.stop();
    logger.info('🛑 PgBoss stopped');
  } catch (e) {
    logger.error(e);
  }

  _boss = null;
}

export async function initBoss(
  pgBossConfig: PgBossConfig,
  cb: () => void
): Promise<any> {

  if (_boss) {
    return _boss;
  }

  if (starting) {
    while (starting) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (_boss) {
      return _boss;
    }
  }

  starting = true;

  try {
    const boss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
      max: pgBossConfig.max ?? 5,
      newConnectionTimeoutSeconds:
        pgBossConfig.newConnectionTimeoutSeconds ?? 30,
      maintenanceIntervalSeconds:
        pgBossConfig.maintenanceIntervalSeconds ?? 60,
      applicationName:
        pgBossConfig.applicationName ?? 'pgboss',
    });

    await boss.start();

    boss.on('error', async (err: any) => {
      logger.error('PgBoss error', err);

      try {
        await boss.stop();
      } catch {}

      if (_boss === boss) {
        _boss = null;
      }

      scheduleReconnect(pgBossConfig, cb);
    });

    boss.on('stop', () => {
      logger.warn('PgBoss stopped');

      if (_boss === boss) {
        _boss = null;
      }

      scheduleReconnect(pgBossConfig, cb);
    });

    _boss = boss;

    logger.info('✅ PgBoss connected');

    cb();

    await registerWorkers();

    return boss;
  } finally {
    starting = false;
  }
}

export function boss() {
  if (!_boss) {
    throw new Error('PgBoss not connected');
  }

  return _boss;
}

export async function startWorker(
  topic: string,
  handler: (jobs: Job[]) => Promise<void>
) {
  const register = async () => {
    const b = boss();

    await b.createQueue(topic);

    await b.work(topic, handler);

    logger.info(`${topic} worker started`);
  };

  workers.push(register);

  if (_boss) {
    await register();
  }
}

export async function startKafkaWorker(
  kafkaConfig: KafkaConfig,
  topic: string
) {
  const register = async () => {
    const producer = await createProducer(kafkaConfig);

    const b = boss();

    await b.createQueue(topic);

    await b.work(topic, async (job: Job) => {
      const j = Array.isArray(job) ? job[0] : job;

      await producer.send(j.name, j.data);

      return true;
    });

    logger.info(`Kafka worker ${topic} started`);
  };

  workers.push(register);

  if (_boss) {
    await register();
  }
}

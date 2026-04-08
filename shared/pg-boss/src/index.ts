import logger from '@shared/logger';

const { PgBoss } = require('pg-boss');

let _boss: typeof PgBoss | null = null;

export async function createBoss(): Promise<typeof PgBoss> {
  if (!_boss) {
    _boss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
    }) as typeof PgBoss;

    logger.log(process.env.DATABASE_URL);

    await _boss.start();
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


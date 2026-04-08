const PgBoss = require('pg-boss');

export type PgBossInstance = {
  start(): Promise<void>;
  publish: (...args: any[]) => Promise<any>;
  work: (...args: any[]) => Promise<any>;
};

let _boss: PgBossInstance | null = null;

export async function createBoss(): Promise<PgBossInstance> {
  if (!_boss) {
    _boss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
    });

    await _boss.start();
    console.log('PgBoss started');
  }

  return _boss;
}

export function boss(): PgBossInstance {
  if (!_boss) {
    throw new Error('Boss has not been initialized. Call createBoss() first.');
  }
  return _boss;
}
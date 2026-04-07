import * as PgBossModule from 'pg-boss';

const { PgBoss } = PgBossModule;

export const boss = new PgBoss({
  connectionString: process.env.DATABASE_URL,
  // опционально:
  // schema: 'pgboss',
  // max: 10, // pool
});

export const startBoss = async () => {
  await boss.start();
};

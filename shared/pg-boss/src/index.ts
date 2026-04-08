import PgBoss from 'pg-boss';

let boss: InstanceType<typeof PgBoss> | null = null;

export async function initBoss() {
  if (!boss) {
    boss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
    });
    await boss.start();
    console.log('PgBoss started');
  }
  return boss;
}

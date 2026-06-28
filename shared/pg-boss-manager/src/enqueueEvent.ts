import pgBossManager from './index';
import logger from "@shared/logger";
// import {Prisma, PrismaClient} from '@prisma/client';

export async function enqueueEvent(topic: string, data: object): Promise<number | null> {
  const jobName = topic;
  // logger.log('here ' + jobName);
  // logger.log(boss.toString());
  const bossObj = await pgBossManager.boss();
  // logger.log(bossObj);
  const jobId = await bossObj.send(jobName, data);

  if (!jobId) {
    throw new Error(`Failed to enqueue event: topic`);
  }

  return Number(jobId);

}

export async function enqueueEventTx(
  topic: string,
  data: object,
  tx: any
): Promise<number | null> {
  const jobName = topic;
  // logger.log('enqueueEventTx ' + jobName);
  return await tx.$executeRawUnsafe(`
      insert into pgboss.job (name, data)
      values ($1, $2::jsonb) returning id
  `, jobName, JSON.stringify(data));
}

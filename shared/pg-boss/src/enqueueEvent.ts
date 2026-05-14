import {boss} from './index';
import logger from "@shared/logger";
// import {Prisma, PrismaClient} from '@prisma/client';

const pgBossKafkaEventPrefix = 'event.';

export async function enqueueEvent(topic: string, data: object): Promise<number | null> {
  const jobName = pgBossKafkaEventPrefix + topic;
  const jobId = await boss().publish(jobName, data);

  if (!jobId) {
    throw new Error(`Failed to enqueue event: topic`);
  }

  return jobId;

}

export async function enqueueEventTx(
  topic: string,
  data: object,
  tx: any
): Promise<number | null> {
  const jobName = pgBossKafkaEventPrefix + topic;
  logger.log('enqueueEventTx ' + jobName);
  const result = await tx.$executeRawUnsafe(`
      insert into pgboss.job (name, data)
      values ($1, $2::jsonb) returning id
  `, jobName, JSON.stringify(data));

  return result;
}

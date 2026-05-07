import {Prisma} from '@prisma/client';

export async function enqueueEventTx(
  tx: Prisma.TransactionClient,
  topic: string,
  data: object
): Promise<string | undefined> {
  const jobName = `event.${topic}`;


  // logger.log(jobName);
  const result = await tx.$queryRaw<{ send: string }[]>`
      insert into pgboss.job (name, data)
      values (${jobName}, ${JSON.stringify(data)}::jsonb)
      returning id
  `;

  return result[0]?.send;
}




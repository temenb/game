import {Prisma} from '@prisma/client';

export async function enqueueEventTx(
  tx: Prisma.TransactionClient,
  topic: string,
  data: object
): Promise<string | undefined> {
  const jobName = `event.${topic}`;

  const result = await tx.$queryRaw<{ send: string }[]>`
    select pgboss.send(${jobName}, ${JSON.stringify(data)})
  `;

  return result[0]?.send;
}

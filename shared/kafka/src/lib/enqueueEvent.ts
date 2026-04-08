import { boss } from '@shared/pg-boss';

export async function enqueueEvent(topic: string, data: object) {
  const jobName = `event.${topic}`;
  const jobId = await boss().send(jobName, data);

  if (!jobId) {
    throw new Error(`Failed to enqueue event: ${topic}`);
  }

  return jobId;

}

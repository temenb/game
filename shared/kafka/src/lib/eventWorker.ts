import { boss } from './pgBoss';
import { createProducer } from '@shared/kafka';

export async function startEventWorker(kafkaConfig) {
  const producer = await createProducer(kafkaConfig);

  await boss.work('event.*', async job => {
    const { name, data } = job;
    const topic = name.replace('event.', '');

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });

    return true;
  });
}

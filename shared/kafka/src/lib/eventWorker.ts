import { boss } from '@shared/pg-boss';
import { createProducer } from '@shared/kafka';

export async function startEventWorker(kafkaConfig) {
  const producer = await createProducer(kafkaConfig);

  await boss().work('event.kafka-*', async job => {
    try {
      const { name, data } = job;
      const topic = name.replace('event.', '');

      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(data) }],
      });

      return true;
    } catch (err) {
      console.error('Kafka send failed:', err);
      throw err; // pg-boss отметит задачу как неуспешную
    }
  });
;
}

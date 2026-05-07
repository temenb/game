import {boss} from '@shared/pg-boss';
import {Job} from 'pg-boss';
import {createProducer, KafkaConfig} from '@shared/kafka';
import logger from "@shared/logger";

export const pgBossKafkaEventName = 'user.created';
export const pgBossKafkaEventPrefix = 'event.';

export async function startUserCreatedWorker(kafkaConfig: KafkaConfig) {
  const producer = await createProducer(kafkaConfig);

  await boss().createQueue(pgBossKafkaEventPrefix + pgBossKafkaEventName);

  await boss().work(pgBossKafkaEventPrefix + pgBossKafkaEventName, async (job: Job) => {
    try {

      const j = Array.isArray(job) ? job[0] : job;
      const {name, data} = j;

      // logger.log(job);
      // logger.log(name);
      // logger.log(data);
      const topic = name.replace('event.', '');

      await producer.send({topic}, data);
      logger.log('pgBoss user.created event successfully done');

      return true;
    } catch (err) {
      logger.error('Kafka send failed:', err);
      throw err;
    }
  });
  logger.log('Kafka user.created event worker started');
}

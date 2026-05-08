const kafkaConfig = {
  brokers: (process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']),
  clientId: process.env.KAFKA_CLIENT_ID || 'fallout-client',
  groupId: process.env.KAFKA_GROUP_ID || 'fallout-service',
};

export default kafkaConfig;

const kafkaConfig = {
  brokers: (process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']),
  clientId: process.env.KAFKA_CLIENT_ID || 'test-client',
  groupId: process.env.KAFKA_GROUP_ID || 'test-service',
};

export default kafkaConfig;

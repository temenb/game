const kafkaConfig = {
  brokers: (process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']),
  clientId: process.env.KAFKA_CLIENT_ID || 'streaming-producer',
  groupId: process.env.KAFKA_GROUP_ID || 'streaming-service',
};

export default kafkaConfig;

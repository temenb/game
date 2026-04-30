const kafkaConfig = {
  brokers: process.env.KAFKA_BROKERS || 'kafka:9092',
  clientId: process.env.KAFKA_CLIENT_ID || 'orchestration-producer',
};

export default kafkaConfig;

const kafkaConfig = {
  brokers: process.env.KAFKA_BROKERS || 'kafka:9092',
  clientId: process.env.KAFKA_CLIENT_ID || 'pawn-client',
};

export default kafkaConfig;
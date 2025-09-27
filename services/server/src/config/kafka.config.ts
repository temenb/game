import dotenv from 'dotenv';

dotenv.config();

const kafkaConfig = {
  brokers: process.env.KAFKA_BROKERS || 'kafka:9092',
};

export default kafkaConfig;

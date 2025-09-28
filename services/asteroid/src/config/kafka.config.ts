import dotenv from 'dotenv';
dotenv.config();

export const kafkaConfig = {
    brokers: process.env.KAFKA_BROKERS || 'kafka:9092',
    clientId: process.env.KAFKA_CLIENT_ID || 'asteroid-client',
};

export const createProfileConsumerConfig = {
    topic: process.env.KAFKA_TOPIC_PROFILE_CREATED || 'profile.created',
    groupId: process.env.KAFKA_GROUP_ID || 'asteroid-service',
    handler: (message: any) => Promise<void>
}

export const createAsteroidProducerConfig = {
    topic: process.env.KAFKA_TOPIC_ASTEROID_CREATED || 'profile.created',
}

export default kafkaConfig;

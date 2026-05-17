import {battleNew} from "../lib/consumers";

export const kafkaConfig = {
  brokers: (process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']),
  clientId: process.env.KAFKA_CLIENT_ID || 'engine-client',
  groupId: process.env.KAFKA_GROUP_ID || 'engine-service',
};


export const kafkaConsumersConfig = {
  battleUpdated: {
    topic: process.env.KAFKA_TOPIC_BATTLE_NEW || 'battle.new',
    handler: battleNew
  },
}

export const kafkaProducersConfig = {
  topicBattleUpdated: process.env.KAFKA_TOPIC_BATTLE_UPDATED || 'battle.updated',
}

export default kafkaConfig;

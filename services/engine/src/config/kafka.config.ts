export const kafkaConfig = {
  brokers: (process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']),
  clientId: process.env.KAFKA_CLIENT_ID || 'engine-client',
  groupId: process.env.KAFKA_GROUP_ID || 'engine-service',
};


export const kafkaProducersConfig = {
  topicBattleNew: process.env.KAFKA_TOPIC_BATTLE_NEW || 'battle.new',
  topicBattleMakeMove: process.env.KAFKA_TOPIC_BATTLE_MAKE_MOVE || 'battle.make-move',
}

export default kafkaConfig;

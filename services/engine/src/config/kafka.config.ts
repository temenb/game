export const kafkaConfig = {
  brokers: process.env.KAFKA_BROKERS || 'kafka:9092',
  clientId: process.env.KAFKA_CLIENT_ID || 'user-client',
  topicUserCreated: process.env.KAFKA_TOPIC_USER_CREATED || 'user.created',
};


export const kafkaProducersConfig = {
  topicBattleNew: process.env.KAFKA_TOPIC_BATTLE_NEW || 'battle.new',
  topicBattleMakeMove: process.env.KAFKA_TOPIC_BATTLE_MAKE_MOVE || 'battle.make-move',
}

export default kafkaConfig;

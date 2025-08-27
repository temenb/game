export type KafkaConfig = {
  clientId: string;
  brokers: string;
};

export type ProducerConfig = {
  topic: string;
};

export type ConsumerConfig = {
  topic: string;
  groupId: string;
  handler: (messages: any) => Promise<void>;
};

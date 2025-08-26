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
  handler: (message: any) => Promise<void>;
};

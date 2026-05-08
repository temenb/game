export type KafkaConfig = {
    clientId: string;
    brokers: string[];
    groupId: string;
};
export type ConsumerConfig = {
    topic: string;
    handler: (messages: any) => Promise<void>;
};

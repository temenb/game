import {ConsumerConfig, KafkaConfig} from './types';

export declare function createConsumer(config: KafkaConfig, consumerConfig: ConsumerConfig): Promise<import("kafkajs").Consumer>;

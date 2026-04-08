import { KafkaConfig, ProducerConfig } from './types';
export declare function createProducer(config: KafkaConfig): Promise<{
    send: ({ topic }: ProducerConfig, message: any) => Promise<void>;
    disconnect: () => Promise<void>;
}>;

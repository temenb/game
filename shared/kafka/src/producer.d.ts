import { KafkaConfig } from './types';
export declare function createProducer(config: KafkaConfig): Promise<{
    send: (topic: String, message: any) => Promise<void>;
    disconnect: () => Promise<void>;
}>;

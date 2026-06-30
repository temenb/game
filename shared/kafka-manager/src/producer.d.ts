import {KafkaConfig} from './types';

export declare function createProducer(config: KafkaConfig): Promise<{
  send: (topic: string, message: any) => Promise<void>;
  disconnect: () => Promise<void>;
}>;

import {Kafka} from "kafkajs";
import {KafkaConfig} from "./types";

export declare function getKafkaInstance(config: KafkaConfig): Promise<Kafka>;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKafkaInstance = getKafkaInstance;
const kafkajs_1 = require("kafkajs");
const kafkaMap = new Map();
function getKafkaInstance(config) {
    const { clientId, brokers } = config;
    if (!kafkaMap.has(clientId)) {
        const brokerList = brokers.split(',').map(b => b.trim());
        const kafka = new kafkajs_1.Kafka({
            clientId,
            brokers: brokerList,
            retry: {
                retries: 5,
                initialRetryTime: 300,
            },
            requestTimeout: 3000,
        });
        kafkaMap.set(clientId, kafka);
    }
    return kafkaMap.get(clientId);
}

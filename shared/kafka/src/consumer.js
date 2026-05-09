"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConsumer = createConsumer;
const register_1 = require("./register");
const kafkajs_1 = require("kafkajs");
const logger_1 = __importDefault(require("@shared/logger"));
async function createConsumer(config, consumerConfig) {
    const kafka = (0, register_1.getKafkaInstance)(config);
    const admin = kafka.admin();
    const consumer = kafka.consumer({ groupId: config.groupId });
    await admin.connect();
    // Проверка существования топика
    const metadata = await admin.fetchTopicMetadata();
    const topicExists = metadata.topics.some(t => t.name === consumerConfig.topic);
    logger_1.default.log('createConsumer config');
    logger_1.default.log(config);
    logger_1.default.log('createConsumer consumerConfig');
    logger_1.default.log(consumerConfig);
    if (!topicExists) {
        await admin.createTopics({
            topics: [{ topic: consumerConfig.topic, numPartitions: 1 }],
            waitForLeaders: true,
        });
    }
    await admin.disconnect();
    await consumer.connect();
    // logger.log(consumerConfig.topic)
    // Подписка с retry на случай гонки
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            await consumer.subscribe({ topic: consumerConfig.topic, fromBeginning: true });
            break;
        }
        catch (err) {
            if (err instanceof kafkajs_1.KafkaJSProtocolError &&
                err.message.includes('does not host this topic-partition')) {
                await new Promise(res => setTimeout(res, 1000));
                continue;
            }
            throw err;
        }
    }
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value?.toString();
            if (value) {
                await consumerConfig.handler(topic, partition, JSON.parse(value));
            }
        },
        retry: { retries: 10, initialRetryTime: 1000 }
    });
    return consumer;
}

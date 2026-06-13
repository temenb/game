"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProducer = createProducer;
const register_1 = require("./register");
const kafkajs_1 = require("kafkajs");
const logger_1 = __importDefault(require("@shared/logger"));
async function createProducer(config) {
    const kafka = await (0, register_1.getKafkaInstance)(config);
    const producer = kafka.producer({
        createPartitioner: kafkajs_1.Partitioners.DefaultPartitioner,
    });
    await producer.connect();
    // проверка и создание топика
    const admin = kafka.admin();
    try {
        await admin.connect();
        await admin.createTopics({
            topics: [{ topic: "battle-stream", numPartitions: 1, replicationFactor: 1 }],
            waitForLeaders: true,
        });
        // logger.info("✅ Topic ensured for producer");
    }
    catch (err) {
        if (err instanceof kafkajs_1.KafkaJSProtocolError && err.type === "UNKNOWN_TOPIC_OR_PARTITION") {
            logger_1.default.warn("⚠️ Topic not found, will retry...");
        }
        else {
            logger_1.default.error("❌ Kafka admin error:", err);
        }
    }
    finally {
        await admin.disconnect();
    }
    return {
        send: async (topic, message) => {
            try {
                await producer.send({
                    topic,
                    messages: [{ value: JSON.stringify(message) }],
                });
            }
            catch (err) {
                logger_1.default.error(`❌ Failed to send to ${topic}:`, err);
                // можно добавить реконнект
                await producer.disconnect();
                await producer.connect();
            }
        },
        disconnect: async () => await producer.disconnect(),
    };
}

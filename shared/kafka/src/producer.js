"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProducer = createProducer;
const register_1 = require("./register");
const kafkajs_1 = require("kafkajs");
async function createProducer(config) {
    const kafka = await (0, register_1.getKafkaInstance)(config);
    const producer = kafka.producer({
        createPartitioner: kafkajs_1.Partitioners.DefaultPartitioner,
    });
    await producer.connect();
    return {
        send: async (topic, message) => {
            await producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
        },
        disconnect: async () => await producer.disconnect(),
    };
}

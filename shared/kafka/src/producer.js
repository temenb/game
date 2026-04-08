"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProducer = createProducer;
const register_1 = require("./register");
async function createProducer(config) {
    const kafka = (0, register_1.getKafkaInstance)(config);
    const producer = kafka.producer();
    await producer.connect();
    return {
        send: async ({ topic }, message) => {
            await producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
        },
        disconnect: async () => await producer.disconnect(),
    };
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.getKafkaInstance = getKafkaInstance;
const kafkajs_1 = require("kafkajs");
const logger_1 = __importDefault(require("@shared/logger"));
const kafkaMap = new Map();
const reconnectAttempts = new Map();

async function getKafkaInstance(config) {
  const {clientId, brokers} = config;
  if (!kafkaMap.has(clientId)) {
    const kafka = new kafkajs_1.Kafka({
      clientId,
      brokers: brokers.map(b => b.trim()),
      retry: {
        retries: 5,
        initialRetryTime: 300,
      },
      requestTimeout: 3000,
    });
    kafkaMap.set(clientId, kafka);
    try {
      await ensureTopics(kafka, clientId);
    } catch (error) {
      logger_1.default.error(`Kafka initialization failed for ${clientId}`, error);
      scheduleReconnect(config, clientId);
    }
  }
  return kafkaMap.get(clientId);
}

async function ensureTopics(kafka, clientId) {
  const admin = kafka.admin();
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    logger_1.default.info(`[Kafka:${clientId}] Connected. Found ${topics.length} topics`);
    reconnectAttempts.set(clientId, 0);
  } finally {
    await admin.disconnect().catch(() => {
    });
  }
}

function scheduleReconnect(config, clientId) {
  const attempts = reconnectAttempts.get(clientId) ?? 0;
  const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
  reconnectAttempts.set(clientId, attempts + 1);
  logger_1.default.warn(`[Kafka:${clientId}] Reconnect scheduled in ${delay} ms`);
  setTimeout(async () => {
    try {
      kafkaMap.delete(clientId);
      await getKafkaInstance(config);
      logger_1.default.info(`[Kafka:${clientId}] Reconnected successfully`);
    } catch (error) {
      logger_1.default.error(`[Kafka:${clientId}] Reconnect failed`, error);
      scheduleReconnect(config, clientId);
    }
  }, delay);
}

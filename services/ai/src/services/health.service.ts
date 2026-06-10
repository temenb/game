import logger from "@shared/logger";
import {createProducer} from '@shared/kafka';

const startedAt = Date.now();

export const health = async () => {
  return {
    healthy: true,
    components: {},
  };
};

export const status = async () => {
  return {
    name: 'ai',
    version: process.env.BUILD_VERSION || 'dev',
    env: process.env.NODE_ENV || 'development',
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  };
};

export const livez = async () => {
  return {
    live: true,
  };
};

export const readyz = async () => {
  return {ready: true};
};

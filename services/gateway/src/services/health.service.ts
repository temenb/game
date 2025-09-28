import {logger} from '@shared/logger';
import * as profileClient from '../grpc/clients/profile.client';
import * as engineClient from '../grpc/clients/engine.client';
import * as falloutClient from '../grpc/clients/fallout.client';
import * as authClient from '../grpc/clients/auth.client';
// import * as mailerClient from '../grpc/clients/mailer.client';
// import * as asteroidClient from '../grpc/clients/asteroid.client';
// import * as shipClient from '../grpc/clients/ship.client';

const startedAt = Date.now();

async function getServicesHealth() {
  const [
    auth,
    profile,
    engine,
    fallout,
    // mailer,
    // asteroid,
    // ship,
  ] = await Promise.all([
    authClient.health(),
    profileClient.health(),
    engineClient.health(),
    falloutClient.health(),
    // mailerClient.health(),
    // asteroidClient.health(),
    // shipClient.health(),
  ]);

  return {
    auth,
    profile,
    engine,
    fallout,
    // mailer,
    // asteroid,
    // ship,
  };
}

export const health = async () => {
  const healthReports = await fullHealth();
  logger.log(healthReports);

  // Формируем объект: { auth: true, profile: true, engine: true, ... }
  const components: Record<string, string> = {};
  for (const [key, value] of Object.entries(healthReports.components ?? {})) {
    components[key] = (value?.healthy ?? false)? 'ok' :  'fail';
  }

  return {
    healthy: healthReports.healthy,
    components,
  };
};

export const fullHealth = async () => {

  const reports = await getServicesHealth();

  const result: {
    healthy: boolean;
    components?: typeof reports;
  } = {
    healthy: Object.values(reports).every(r => r?.healthy === true),
  };

    result.components = reports;

  return result;
}

export const status = async () => {
  return {
    name: 'gateway',
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
  const pgOk = true;
  const kafkaOk = true;
  return {ready: pgOk && kafkaOk};
};

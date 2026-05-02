import {logger} from '@shared/logger';
import * as profileClient from '../grpc/clients/profile.client';
import * as orchestrationClient from '../grpc/clients/orchestration.client';
import * as engineClient from '../grpc/clients/engine.client';
import * as falloutClient from '../grpc/clients/fallout.client';
import * as authClient from '../grpc/clients/auth.client';
// import * as mailerClient from '../grpc/clients/mailer.client';
import * as spawnerClient from '../grpc/clients/spawner.client';
import * as pawnClient from '../grpc/clients/pawn.client';

const startedAt = Date.now();

///////////////////////////////////////////////////////////////////////////////////
// const clients = {
//   auth: authClient,
//   profile: profileClient,
//   // engine: engineClient,
//   // fallout: falloutClient,
//   // mailer: mailerClient,
//   // spawner: spawnerClient,
//   // pawn: pawnClient,
// };
//
//
// async function getServicesHealth(service) {
//   return await clients.{service}.authClient.health();
// }
//
// export const health = async (service: string) => {
//   if (!service) {
//     return { serving: 'UNKNOWN' };
//   }
//
//   const healthReports = await getServicesHealth(service);
// };
///////////////////////////////////////////////////////////////////////////////////


async function getServicesHealth() {
  const [
    auth,
    profile,
    orchestration,
    // engine,
    fallout,
    // mailer,
    // spawner,
    // pawn,
  ] = await Promise.all([
    authClient.health(),
    profileClient.health(),
    orchestrationClient.health(),
    // engineClient.health(),
    falloutClient.health(),
    // mailerClient.health(),
    // spawnerClient.health(),
    // pawnClient.health(),
  ]);

  return {
    auth,
    profile,
    orchestration,
    // engine,
    fallout,
    // mailer,
    // spawner,
    // pawn,
  };
}

export const health = async () => {
  const healthReports = await fullHealth();
  // logger.log(healthReports);

  // Формируем объект: { auth: true, profile: true, engine: true, ... }
  const components: Record<string, string> = {};
  for (const [key, value] of Object.entries(healthReports.components ?? {})) {
    components[key] = (value?.healthy ?? false) ? 'ok' : 'fail';
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
    name: 'streaming',
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

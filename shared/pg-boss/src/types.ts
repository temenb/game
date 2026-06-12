export type PgBossConfig = {
  max?: number;
  newConnectionTimeoutSeconds?: number;
  maintenanceIntervalSeconds?: number;
  applicationName: string;
};

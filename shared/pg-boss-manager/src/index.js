"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgBossManager = void 0;
const logger_1 = __importDefault(require("@shared/logger"));
const kafka_manager_1 = require("@shared/kafka-manager");
const pg_boss_1 = require("pg-boss");
class PgBossManager {
    _boss = null;
    workers = [];
    constructor() {
        logger_1.default.log(__filename);
        // Таймер проверки состояния PgBoss
        setInterval(() => {
            if (this._boss) {
                console.log("✅ PgBoss instance exists");
            }
            else {
                console.log("❌ PgBoss is null");
            }
        }, 1000);
    }
    setBoss(boss) {
        logger_1.default.log('setPgboss');
        this._boss = boss;
    }
    initBoss = (config, cb) => {
        return (async () => {
            const boss = new pg_boss_1.PgBoss({
                connectionString: process.env.DATABASE_URL,
                max: config.max ?? 5,
                maintenanceIntervalSeconds: config.maintenanceIntervalSeconds ?? 60,
                application_name: config.applicationName ?? 'pgboss',
            });
            await boss.start();
            this.setBoss(boss);
            logger_1.default.info('✅ PgBoss connected');
            cb();
            return boss;
        })();
    };
    boss = async () => {
        if (!this._boss) {
            throw new Error('PgBoss not initialized');
        }
        return this._boss;
    };
    stopBoss = async () => {
        logger_1.default.info('Stop Boss !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        if (!this._boss)
            return;
        try {
            await this._boss.stop();
            logger_1.default.info('🛑 PgBoss stopped');
        }
        catch (e) {
            logger_1.default.error('PgBoss stop error', e);
        }
        finally {
            this._boss = null;
            // workersStarted = false;
        }
    };
    /**
     * GENERIC WORKER
     */
    startWorker = async (topic, handler) => {
        const register = async () => {
            const boss = await this.boss();
            await boss.createQueue(topic);
            await boss.work(topic, handler);
            logger_1.default.info(`📦 Worker started: ${topic}`);
        };
        this.workers.push(register);
        if (this._boss) {
            await register();
        }
    };
    /**
     * KAFKA WORKER (batch-safe)
     */
    startKafkaWorker = async (kafkaConfig, topic) => {
        const register = async () => {
            const producer = await (0, kafka_manager_1.createProducer)(kafkaConfig);
            const b = await this.boss();
            await b.createQueue(topic);
            await b.work(topic, { batchSize: 10 }, async (jobs) => {
                for (const j of jobs) {
                    await producer.send(j.name, j.data);
                }
                return true;
            });
            logger_1.default.info(`Kafka worker started: ${topic}`);
        };
        this.workers.push(register);
        if (this._boss) {
            await register();
        }
    };
    enqueueEvent = async (topic, data) => {
        const jobName = topic;
        // logger.log('here ' + jobName);
        // logger.log(boss.toString());
        const bossObj = await pgBossManager.boss();
        // logger.log(bossObj);
        const jobId = await bossObj.send(jobName, data);
        if (!jobId) {
            throw new Error(`Failed to enqueue event: topic`);
        }
        return Number(jobId);
    };
    enqueueEventTx = async (topic, data, tx) => {
        const jobName = topic;
        // logger.log('enqueueEventTx ' + jobName);
        return await tx.$executeRawUnsafe(`
      insert into pgboss.job (name, data)
      values ($1, $2::jsonb) returning id
  `, jobName, JSON.stringify(data));
    };
}
exports.PgBossManager = PgBossManager;
const pgBossManager = new PgBossManager();
exports.default = pgBossManager;

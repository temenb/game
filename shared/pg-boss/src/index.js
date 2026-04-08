"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBoss = initBoss;
const pg_boss_1 = __importDefault(require("pg-boss"));
let boss = null;
async function initBoss() {
    if (!boss) {
        boss = new pg_boss_1.default({
            connectionString: process.env.DATABASE_URL,
        });
        await boss.start();
        console.log('PgBoss started');
    }
    return boss;
}

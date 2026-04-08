"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBoss = initBoss;
exports.boss = boss;
const { PgBoss } = require('pg-boss');
let _boss = null;
async function initBoss(cb) {
    if (!_boss) {
        _boss = new PgBoss({
            connectionString: process.env.DATABASE_URL,
        });
        // logger.log(process.env.DATABASE_URL);
        await _boss.start();
        cb();
        console.log('PgBoss started');
    }
    return _boss;
}
function boss() {
    if (!_boss) {
        throw new Error('Boss has not been initialized. Call createBoss() first.');
    }
    return _boss;
}

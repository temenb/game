"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBoss = createBoss;
exports.boss = boss;
const PgBoss = require('pg-boss');
let _boss = null;
async function createBoss() {
    if (!_boss) {
        _boss = new PgBoss({
            connectionString: process.env.DATABASE_URL,
        });
        await _boss.start();
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

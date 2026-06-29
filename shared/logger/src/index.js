"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function getCallerLocation() {
    const stack = new Error().stack?.split("\n")[3]; // уровень глубже
    const match = stack?.match(/\((.*):(\d+):(\d+)\)/);
    if (match) {
        const [, file, line] = match;
        return `${file}:${line}`;
    }
    return "unknown";
}
function getTimestamp() {
    return new Date().toISOString(); // или new Date().toLocaleString()
}
exports.logger = {
    log: (...args) => {
        console.log("\n", `[${getTimestamp()}]`, ...args, "\n", `[${getCallerLocation()}]`, "\n");
    },
    info: (...args) => {
        console.log("\n", `[${getTimestamp()}]`, ...args, "\n", `[${getCallerLocation()}]`, "\n");
    },
    warn: (...args) => {
        console.log("\n", `[${getTimestamp()}]`, ...args, "\n", `[${getCallerLocation()}]`, "\n");
    },
    error: (...args) => {
        console.log("\n", `[${getTimestamp()}]`, ...args, "\n", `[${getCallerLocation()}]`, "\n");
    },
};
exports.default = exports.logger;

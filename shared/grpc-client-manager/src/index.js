"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcClientManager = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const logger_1 = __importDefault(require("@shared/logger"));
class GrpcClientManager {
    createClient;
    client;
    constructor(createClient) {
        this.createClient = createClient;
        this.client = this.createClient();
    }
    reconnect() {
        logger_1.default.warn('🔄 Reconnecting gRPC client...');
        this.client = this.createClient();
    }
    isRecoverableError(err) {
        if (!err) {
            return false;
        }
        const recoverableCodes = [
            grpc.status.UNAVAILABLE,
            grpc.status.DEADLINE_EXCEEDED,
            grpc.status.RESOURCE_EXHAUSTED, // иногда
            grpc.status.ABORTED, // можно добавить с осторожностью
        ];
        return Boolean(recoverableCodes.includes(err.code) ||
            (err.code === grpc.status.INTERNAL &&
                err.details?.includes('connection') ||
                err.details?.includes('timeout')));
    }
    async call(fn) {
        try {
            return await this.execute(fn);
        }
        catch (err) {
            if (err instanceof Error &&
                'code' in err &&
                this.isRecoverableError(err)) {
                logger_1.default.warn({
                    err,
                }, '🔁 gRPC recoverable error — retrying');
                this.reconnect();
                return this.execute(fn);
            }
            throw err;
        }
    }
    execute(fn) {
        return new Promise((resolve, reject) => {
            fn(this.client, (err, res) => {
                if (err) {
                    logger_1.default.error({
                        code: err.code,
                        details: err.details,
                        metadata: err.metadata?.getMap?.(),
                    }, 'gRPC request failed');
                    return reject(err);
                }
                resolve(res);
            });
        });
    }
}
exports.GrpcClientManager = GrpcClientManager;

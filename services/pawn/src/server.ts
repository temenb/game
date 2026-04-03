import server from './app';
import * as grpc from '@grpc/grpc-js';
import config from './config/config';
const PORT = config.port;
import logger from '@shared/logger';

server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    logger.log(`🚀 gRPC server running on port ${PORT}`);
});

server.tryShutdown(() => {
    logger.log('✅ gRPC server gracefully shut down');
});
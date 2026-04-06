import server from './app';
import * as grpc from '@grpc/grpc-js';

const PORT = process.env.PORT || 50051;

server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`🚀 gRPC server running on port ${PORT}`);
});

server.tryShutdown(() => {
    console.log('✅ gRPC server gracefully shut down');
});

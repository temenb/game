import * as grpc from '@grpc/grpc-js';
export type GrpcClientFactory<T> = () => T;
export type GrpcCall<TClient, TResult> = (client: TClient, cb: (err: grpc.ServiceError | null, res: TResult) => void) => void;
export declare class GrpcClientManager<TClient> {
    private readonly createClient;
    private client;
    constructor(createClient: GrpcClientFactory<TClient>);
    private reconnect;
    private isRecoverableError;
    call<TResult>(fn: GrpcCall<TClient, TResult>): Promise<TResult>;
    private execute;
}
//# sourceMappingURL=index.d.ts.map
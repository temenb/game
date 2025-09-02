import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';

export type GrpcClientFactory<T> = () => T;
export type GrpcCall<TClient, TResult> = (
  client: TClient,
  cb: (err: grpc.ServiceError | null, res?: TResult) => void
) => void;

export class GrpcClientManager<TClient> {
  private client: TClient;

  constructor(private createClient: GrpcClientFactory<TClient>) {
    this.client = this.createClient();
  }

  private reconnect() {
    logger.warn('🔄 Reconnecting gRPC client...');
    this.client = this.createClient();
  }

  private isRecoverableError(err: grpc.ServiceError | null): boolean {
    return !!err && [
      grpc.status.UNAVAILABLE,
      grpc.status.DEADLINE_EXCEEDED,
      grpc.status.INTERNAL,
    ].includes(err.code);
  }

  public async call<TResult>(fn: GrpcCall<TClient, TResult>): Promise<TResult> {
    return new Promise((resolve, reject) => {
      fn(this.client, (err, res) => {
        if (this.isRecoverableError(err)) {
          logger.info('🔁 gRPC error — retrying...');
          this.reconnect();
          return fn(this.client, (retryErr, retryRes) => {
            if (retryErr || !retryRes) {
              logger.error('gRPC retry failed:', retryErr);
              return reject(new Error('gRPC retry failed'));
            }
            resolve(retryRes);
          });
        }

        if (err || !res) {
          logger.error('gRPC error:', err);
          return reject(new Error('Internal gRPC error'));
        }

        resolve(res);
      });
    });
  }
}

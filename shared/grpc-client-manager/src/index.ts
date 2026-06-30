import * as grpc from '@grpc/grpc-js';
import logger from '../../logger';

export type GrpcClientFactory<T> = () => T;

export type GrpcCall<TClient, TResult> = (
  client: TClient,
  cb: (
    err: grpc.ServiceError | null,
    res: TResult
  ) => void
) => void;

export class GrpcClientManager<TClient> {

  private client: TClient;

  constructor(
    private readonly createClient: GrpcClientFactory<TClient>
  ) {
    this.client = this.createClient();
  }

  public async call<TResult>(
    fn: GrpcCall<TClient, TResult>
  ): Promise<TResult> {

    try {
      return await this.execute(fn);

    } catch (err) {

      if (
        err instanceof Error &&
        'code' in err &&
        this.isRecoverableError(err as grpc.ServiceError)
      ) {

        logger.warn({
          err,
        }, '🔁 gRPC recoverable error — retrying');

        this.reconnect();

        return this.execute(fn);
      }

      throw err;
    }
  }

  private reconnect() {
    logger.warn('🔄 Reconnecting gRPC client...');
    this.client = this.createClient();
  }

  private isRecoverableError(
    err: grpc.ServiceError | null
  ): boolean {

    if (!err) {
      return false;
    }

    const recoverableCodes = [
      grpc.status.UNAVAILABLE,
      grpc.status.DEADLINE_EXCEEDED,
      grpc.status.RESOURCE_EXHAUSTED,   // иногда
      grpc.status.ABORTED,              // можно добавить с осторожностью
    ];

    return Boolean(recoverableCodes.includes(err.code) ||
      (err.code === grpc.status.INTERNAL &&
        err.details?.includes('connection') ||
        err.details?.includes('timeout')));
  }

  private execute<TResult>(
    fn: GrpcCall<TClient, TResult>
  ): Promise<TResult> {

    return new Promise((resolve, reject) => {

      fn(this.client, (err, res) => {

        if (err) {

          logger.error({
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
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';

export function extractAuthHeader(call: grpc.ServerUnaryCall<any, any>): string {
  const authHeader = call.metadata.get('authorization')[0] as string;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }
  return authHeader;
}

export function forwardAuthMetadata(call: grpc.ServerUnaryCall<any, any>): grpc.Metadata {
  const authHeader = extractAuthHeader(call);
  const metadata = new grpc.Metadata();
  // logger.log(authHeader);
  metadata.add('authorization', authHeader);
  return metadata;
}

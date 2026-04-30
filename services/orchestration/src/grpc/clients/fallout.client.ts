import * as grpc from '@grpc/grpc-js';
import * as FalloutGrpc from '../generated/fallout';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const falloutManager = new GrpcClientManager<FalloutGrpc.FalloutClient>(() => {
  return new FalloutGrpc.FalloutClient(config.serviceFalloutUrl, grpc.credentials.createInsecure());
});


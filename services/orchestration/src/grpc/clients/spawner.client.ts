import * as grpc from '@grpc/grpc-js';
import * as SpawnerGrpc from '../generated/spawner';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const spawnerManager = new GrpcClientManager<SpawnerGrpc.SpawnerClient>(() => {
  return new SpawnerGrpc.SpawnerClient(config.serviceSpawnerUrl, grpc.credentials.createInsecure());
});


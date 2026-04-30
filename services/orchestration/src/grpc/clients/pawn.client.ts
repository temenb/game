import * as grpc from '@grpc/grpc-js';
import * as PawnGrpc from '../generated/pawn';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const pawnManager = new GrpcClientManager<PawnGrpc.PawnClient>(() => {
  return new PawnGrpc.PawnClient(config.servicePawnUrl, grpc.credentials.createInsecure());
});


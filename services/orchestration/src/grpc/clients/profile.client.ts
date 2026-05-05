import * as grpc from '@grpc/grpc-js';
import * as ProfileGrpc from '../generated/profile';
import * as HealthGrpc from '../generated/common/health';
import * as EmptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const profileManager = new GrpcClientManager<ProfileGrpc.ProfileClient>(() => {
  return new ProfileGrpc.ProfileClient(config.serviceProfileUrl, grpc.credentials.createInsecure());
});

export const viewProfile = (userId: string): Promise<ProfileGrpc.ProfileObject | null> => {
  const grpcRequest: ProfileGrpc.UserIdRequest = {userId};
  return profileManager.call((client, cb) => client.getProfileByUser(grpcRequest, cb));
};

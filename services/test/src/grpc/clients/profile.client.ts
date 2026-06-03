// import * as grpc from '@grpc/grpc-js';
// import * as profileGrpc from '../generated/profile';
// import * as healthGrpc from '../generated/common/health';
// import * as emptyGrpc from '../generated/common/empty';
// import config from '../../config/config';
// import {GrpcClientManager} from '@shared/grpc-client-manager';
//
// const profileManager = new GrpcClientManager<profileGrpc.ProfileClient>(() => {
//   return new profileGrpc.ProfileClient(config.serviceProfileUrl, grpc.credentials.createInsecure());
// });
//
// export const getProfile = (userId: string): Promise<profileGrpc.ProfileObject | null> => {
//   const grpcRequest: profileGrpc.UserIdRequest = {userId};
//   return profileManager.call((client, cb) => client.getProfileByUser(grpcRequest, cb));
// };

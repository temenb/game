// export const getMyProfile = async (
//   call: grpc.ServerUnaryCall<emptyGrpc.Empty, profileGrpc.ProfileObject>,
//   callback: grpc.sendUnaryData<profileGrpc.ProfileObject>
// ) => {
//   try {
//     const userId = getUserIdFromMetadata(call);
//
//     const response = await profileService.getProfile(userId);
//
//     callback(null, response);
//
//   } catch (err: any) {
//     logger.log(err);
//     callbackError(callback, err);
//   }
// };

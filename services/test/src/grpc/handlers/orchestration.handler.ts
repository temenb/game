// export const getMyProfile = async (
//   call: grpc.ServerUnaryCall<EmptyGrpc.Empty, ProfileGrpc.ProfileObject>,
//   callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
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

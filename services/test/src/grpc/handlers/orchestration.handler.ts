import * as grpc from '@grpc/grpc-js';
import * as EmptyGrpc from '../generated/common/empty';
import * as ProfileGrpc from '../generated/profile';
import * as profileService from '../../services/profile.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";

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

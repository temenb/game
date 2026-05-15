import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as ProfileGrpc from '../generated/profile';
import * as AuthService from '../../services/auth.service';
import * as OrchestrationService from '../../services/orchestration.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import * as EmptyGrpc from "../generated/common/empty";
import {forwardAuthMetadata} from "../../lib/authMetadata";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";
import * as profileService from "../../services/profile.service";



// export const getMyProfile = async (
//   call: grpc.ServerUnaryCall<EmptyGrpc.Empty, ProfileGrpc.ProfileObject>,
//   callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
// ) => {
//   try {
//     const userId = getUserIdFromMetadata(call);
//
//     const response = await profileService.getProfileByUser(userId);
//
//     callback(null, response);
//
//   } catch (err: any) {
//     logger.log(err);
//     callbackError(callback, err);
//   }
// };
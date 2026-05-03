import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../generated/battle';
import * as BattleService from '../../services/battle.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";

// export const upsert = async (
//   call: grpc.ServerUnaryCall<BattleGrpc.UserIdRequest, BattleGrpc.BattleObject>,
//   callback: grpc.sendUnaryData<BattleGrpc.BattleObject>
// ) => {
//   const {userId} = call.request;
//
//   try {
//     const result = await BattleService.upsertBattle(userId);
//
//     callback(null, {
//       id: result.id,
//       ownerId: result.ownerId,
//       nickname: result.nickname,
//       level: result.level,
//       rating: result.rating,
//       experience: result.experience,
//     });
//
//   } catch (err: any) {
//     logger.log(err);
//     callback({
//       code: grpc.status.INTERNAL,
//       message: err.message,
//     }, null);
//   }
// };
//
//   export const viewBattleByUser = async (
//   call: grpc.ServerUnaryCall<BattleGrpc.UserIdRequest, BattleGrpc.BattleObject>,
//   callback: grpc.sendUnaryData<BattleGrpc.BattleObject>
// ) => {
//   const {userId} = call.request;
//
//   try {
//     const result = await BattleService.getBattle(userId);
//
//     if (!result) {
//       throw new Error("Expected result, but got null");
//     }
//
//     callback(null, {
//       id: result.id,
//       ownerId: result.ownerId,
//       nickname: result.nickname,
//       level: result.level,
//       rating: result.rating,
//       experience: result.experience,
//     });
//
//   } catch (err: any) {
//     logger.log(err);
//     callback({
//       code: grpc.status.INTERNAL,
//       message: err.message,
//     }, null);
//   }
// };

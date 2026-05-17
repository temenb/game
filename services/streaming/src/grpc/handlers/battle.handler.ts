import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../generated/battle';
import * as ProfileGrpc from '../generated/profile';
import * as StreamingGrpc from '../generated/streaming';
import * as AuthService from '../../services/auth.service';
import * as OrchestrationService from '../../services/orchestration.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import * as EmptyGrpc from "../generated/common/empty";
import {forwardAuthMetadata} from "../../lib/authMetadata";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";
import * as profileService from "../../services/profile.service";
import * as engineService from "../../services/engine.service";
import * as battleService from "../../services/battle.service";

const activeBattleStreams = new Map<string, Set<grpc.ServerDuplexStream<StreamingGrpc.ClientRequest, BattleGrpc.BattleObject>>>();

export async function battleChannel(
  call: grpc.ServerDuplexStream<StreamingGrpc.ClientRequest, BattleGrpc.BattleObject>) {
  call.on('data', async (event: StreamingGrpc.ClientRequest) => {

    const userId = getUserIdFromMetadata(call);

    if (event.join) {
      const battle = await battleService.upsertBattle(userId);

      if (!battle) {
        throw new Error("Battle not found");
      }

      call.write(battle);
    }

    if (event.move) {
      if (userId != event.move.userId) {
        throw new Error("Unknown error");
      }
      engineService.makeMove(event.move);
    }
  });

  call.on('end', () => {
    call.end();
  });

  // const timer = setTimeout(async () => {
  //   const finished = await finishBattle("battleId");
  //   call.write(finished);
  //   call.end();
  // }, 60000);

  call.on('end', () => {
    // clearTimeout(timer);
    call.end();
  });
}


// export const getBattle = async (
//   call: grpc.ServerUnaryCall<EmptyGrpc.Empty, ProfileGrpc.ProfileObject>,
//   callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
// ) => {
//   try {
//     const {battleId} = call.request;
//
//     const response = await battleService.getBattle(battleId);
//
//     callback(null, response);
//
//   } catch (err: any) {
//     logger.log(err);
//     callbackError(callback, err);
//   }
// };
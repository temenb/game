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
import * as battleService from "../../services/battle.service";

const activeBattleStreams = new Map<string, Set<grpc.ServerDuplexStream<StreamingGrpc.ClientRequest, BattleGrpc.BattleObject>>>();

export async function battleChannel(
  call: grpc.ServerDuplexStream<StreamingGrpc.ClientRequest, BattleGrpc.BattleObject>) {
  call.on('data', async (event: StreamingGrpc.ClientRequest) => {







    if (event.join) {
      // создать или найти баттл
      const battle = await battleService.upsertBattle(event.join.userId);
      call.write(battle);
    }

    if (event.move) {      // обработать ход
      const updated = await processMove(event.battleId, event.playerId, event.cellIndex, event.moveType);
      call.write(updated);
    }
  });

  call.on('end', () => {
    call.end();
  });









  if (event.join) {

    const userId = getUserIdFromMetadata(call);

    const metadata = forwardAuthMetadata(call);
    const response = await profileService.upsertBattle(userId);

      const battle = await upsertBattle(event.playerId);

      if (!activeBattleStreams.has(battle.id)) {
        activeBattleStreams.set(battle.id, new Set());
      }
      activeBattleStreams.get(battle.id)!.add(call);
      call.write(battle);
    }

    if (event.move) {
      // обработать ход
      const updated = await processMove(event.battleId, event.playerId, event.cellIndex, event.moveType);
      call.write(updated);
    }
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


export const getBattle = async (
  call: grpc.ServerUnaryCall<EmptyGrpc.Empty, ProfileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<ProfileGrpc.ProfileObject>
) => {
  try {
    const {battleId} = call.request;

    const response = await battleService.getBattle(battleId);

    callback(null, response);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};
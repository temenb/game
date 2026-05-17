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
        call.emit("error", "Battle not found");
        return;
      }

      if (!activeBattleStreams.has(battle.id)) {
        activeBattleStreams.set(battle.id, new Set());
      }
      activeBattleStreams.get(battle.id)!.add(call);
      call.write(battle);
    }

    if (event.move) {
      if (userId != event.move.userId) {
        call.emit("error", "Unknown error");
      }
      engineService.makeMove(event.move);
    }
  });

  call.on("end", () => {
    // удаляем стрим из активных
    for (const [battleId, streams] of activeBattleStreams.entries()) {
      streams.delete(call);
      if (streams.size === 0) {
        activeBattleStreams.delete(battleId);
      }
    }
    call.end();
  });
}



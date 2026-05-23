import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../generated/battle';
import * as StreamingGrpc from '../generated/streaming';
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";
import * as engineService from "../../services/engine.service";
import * as battleService from "../../services/battle.service";
import logger from "@shared/logger";

const activeBattleStreams = new Map<string, Set<grpc.ServerDuplexStream<StreamingGrpc.ClientRequest, BattleGrpc.BattleObject>>>();

export function getBattleStream(
  battleId: string
): Set<grpc.ServerDuplexStream<StreamingGrpc.ClientRequest, BattleGrpc.BattleObject>> | undefined {

  return activeBattleStreams.get(battleId);
}

export function deleteActiveBattleStream(
  battleId: string
) {

  activeBattleStreams.delete(battleId);
}

export async function battleChannel(
  call: grpc.ServerDuplexStream<StreamingGrpc.ClientRequest, BattleGrpc.BattleObject>) {
  call.on('data', async (event: StreamingGrpc.ClientRequest) => {


    logger.log("Active battle streams:", Array.from(activeBattleStreams.keys()));

    const userId = getUserIdFromMetadata(call);

    if (event.join) {
      const battle = await battleService.upsertBattle(userId);

      if (!battle) {
        call.emit("error", new Error("Battle not found"));
        return;
      }

      if (!activeBattleStreams.has(battle.id)) {
        activeBattleStreams.set(battle.id, new Set());
      }
      activeBattleStreams.get(battle.id)!.add(call);
      logger.log("Activete battle stream :", battle.id);
      call.write(battle);
    }

    if (event.move) {
      if (userId != event.move.userId) {
        call.emit("error", new Error("Unknown error"));
      }
      engineService.makeMove(event.move);
    }
  });
}



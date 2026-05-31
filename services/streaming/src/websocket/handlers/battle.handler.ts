import {BattleStreamRequest} from "../../grpc/generated/streaming";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";
import * as battleService from "../../services/battle.service";
import * as engineService from "../../services/engine.service";
import logger from "@shared/logger";
import BattleStreamRegistry from "../../channels/front.battle.stream";

export function battleHandler(ws: WebSocket, payload: BattleStreamRequest) {

    const userId = getUserIdFromMetadata(ws);

    if (event.join) {
      logger.log("Battle join event");
      const battle = await battleService.upsertBattle(userId);

      if (!battle) {
        ws.emit("error", new Error("Battle not found"));
        return;
      }
      BattleStreamRegistry.setBattleStream(battle.id, ws);
      logger.log("Battle stream was set:" + battle.id);
      BattleStreamRegistry.writeBattleStreams(battle);
    }

    if (event.move) {
      logger.log("Battle move event");
      if (userId != event.move.userId) {
        call.emit("error", new Error("Unknown error"));
      }
      engineService.makeMove(event.move);
    }

    // if (event.leave) {
    //   const battleId = event.leave.battleId;
    //   const streams = battleStreams.get(battleId);
    //   if (streams) {
    //     streams.delete(call);
    //     if (streams.size === 0) {
    //       battleStreams.delete(battleId);
    //     }
    //   }
    //   call.end();
    // }
    //
    // if (event.end) {
    //   const battleId = event.end.battleId;
    //   const streams = battleStreams.get(battleId);
    //   if (streams) {
    //     for (const stream of streams) {
    //       stream.end();
    //     }
    //     battleStreams.delete(battleId);
    //   }
    // }
    //
    // if (event.ping) {
    //   call.write({ ping: true } as any); // можно вернуть простое подтверждение
    // }
  });
}


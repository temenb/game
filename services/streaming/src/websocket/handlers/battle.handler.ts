import type { WebSocket } from "ws";
import {BattleStreamRequest} from "../../grpc/generated/streaming";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";
import * as battleService from "../../services/battle.service";
import * as engineService from "../../services/engine.service";
import logger from "@shared/logger";
import BattleStreamRegistry from "../../channels/front.battle.stream";

export async function battleHandler(ws: WebSocket, userId: string, payload: BattleStreamRequest) {

  logger.log('battleHandler!!!!!!!!!!!111');

  logger.log(userId);
  logger.log(payload);

  //
  // const msg: BattleMessage = JSON.parse(data.toString());
  // logger.log('📩 Message:', msg);
  //
  // if (msg.type === 'join') {
  //   // логика подключения игрока
  //   ws.send(JSON.stringify({ type: 'joined', battleId: msg.battleId, userId: msg.userId }));
  // }
  //
  // if (msg.type === 'move') {
  //   // логика хода
  //   ws.send(JSON.stringify({ type: 'moved', battleId: msg.battleId, userId: msg.userId, cellIdx: msg.cellIdx }));
  // }
  //

  if (payload.join) {
    logger.log("Battle join event");
    const battle = await battleService.upsertBattle(userId);

    if (!battle) {
      ws.send(JSON.stringify({
        type: "error",
        payload: { message: "Battle not found" }
      }));
      return;
    }
    BattleStreamRegistry.setBattleStream(battle.id, ws);
    logger.log("Battle stream was set:" + battle.id);
    BattleStreamRegistry.writeBattleStreams(battle);
  }

  if (payload.move) {
    logger.log("Battle move event");
    if (userId != payload.move.userId) {
      ws.send(JSON.stringify({
        type: "error",
        payload: { message: "Unknown error" }
      }));
      return;
    }
    engineService.makeMove(payload.move);
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
}


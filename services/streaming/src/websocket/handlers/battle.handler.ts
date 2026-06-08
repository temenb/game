import type {WebSocket} from "ws";
import * as streamingGrpc from "../../grpc/generated/streaming";
import * as battleService from "../../services/battle.service";
import * as engineService from "../../services/engine.service";
import logger from "@shared/logger";
import FrontBattleStreamRegistry from "../../channels/front.battle.stream";
import {ErrorObject} from "../../grpc/generated/common/error";
import * as profileService from "../../services/profile.service";


async function isAllowedUser(userId: string, profileId: string) {

  const profile = await profileService.getProfileByUser(userId);

  if (!profile) {
    throw new Error("Profile not found");
  }

  if (profile.id !== profileId) {
    throw new Error("Access deined");
  }
}

export async function battleHandler(ws: WebSocket, userId: string, payload: streamingGrpc.BattleStreamRequest) {
  if (payload.join) {
    logger.log("Battle join event");
    const battle = await battleService.upsertBattle(payload.join);

    if (!battle) {
      const error = ErrorObject.create({
        type: "error",
        message: "Battle not found"
      });
      const buffer = ErrorObject.encode(error).finish();
      ws.send(buffer);

      return;
    }
    FrontBattleStreamRegistry.setBattleStream(battle.id, ws);
    logger.log("Battle stream was set:" + battle.id);
    try {
      FrontBattleStreamRegistry.writeBattleStreams(battle);
    } catch (e) {
      logger.error(String(e));
    }
  }

  if (payload.move) {
    logger.log("Battle move event");

    try {
      isAllowedUser(userId, payload.move.profileId)
    } catch (error) {
      const errObj = ErrorObject.create({
        type: "error",
        message: "Battle not found"
      });
      const buffer = ErrorObject.encode(errObj).finish();
      ws.send(buffer);
      return;
    }
    engineService.makeMove(payload.move);
  }

  // if (payload.leave) {
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
  // if (payload.end) {
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
  if (payload.ping) {
    try {
      FrontBattleStreamRegistry.writeDataStreams('', 'ping', {message: 'pong'});
    } catch (e) {
      logger.error(String(e));
    }
  }
}


import type {WebSocket} from "ws";
import * as streamingGrpc from "../../grpc/generated/streaming";
import * as battleService from "../../services/battle.service";
import * as engineGrpc from "../../grpc/generated/engine";
import * as battleGrpc from "../../grpc/generated/battle";
import logger from "@shared/logger";
import FrontBattleStreamRegistry from "../channels/front.battle.stream";
import * as profileService from "../../services/profile.service";
import {ErrorObject} from "../../grpc/generated/common/error";
import engineStream from "../../grpc/channels/engine.stream";


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
    // logger.log("Battle join event");
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
    // logger.log("Battle stream was set:" + battle.id);
    try {
      if (battle.status == battleGrpc.BattleStatus.ACTIVE) {
        const grpcRequest = engineGrpc.BattleChannelClientEvent.create({start: battleGrpc.BattleRequest.create({battle})})
        engineStream.write(grpcRequest);
      }

      FrontBattleStreamRegistry.writeBattleStreams(battle);
    } catch (e) {
      logger.error(String(e));
    }
  }

  if (payload.move) {
    // logger.log("Battle move event");

    try {
      await isAllowedUser(userId, payload.move.profileId)
    } catch (error) {
      const errObj = ErrorObject.create({
        type: "error",
        message: String(error)
      });
      const buffer = ErrorObject.encode(errObj).finish();
      ws.send(buffer);
      return;
    }

    const grpcRequest = engineGrpc.BattleChannelClientEvent.create({
      move: payload.move,
    });

    engineStream.write(grpcRequest);

  }

  if (payload.ping) {
    // FrontBattleStreamRegistry.writeDataStreams(battle.id, 'ping', {});
  }

  if (payload.connectAi) {

    // FrontBattleStreamRegistry.writeDataStreams(battle.id, 'ping', {});
  }

  if (payload.leave) {
    const grpcRequest = engineGrpc.BattleChannelClientEvent.create({
      leave: engineGrpc.BattleLeaveRequest.create(payload.leave),
    });

    engineStream.write(grpcRequest);


    // const battleId = event.leave.battleId;
    // const streams = battleStreams.get(battleId);
    // if (streams) {
    //   streams.delete(call);
    //   if (streams.size === 0) {
    //     battleStreams.delete(battleId);
    //   }
    // }
    // call.end();
  }
}


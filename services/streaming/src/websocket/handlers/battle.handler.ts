import type {WebSocket} from "ws";
import * as streamingGrpc from "../../grpc/generated/streaming";
import * as battleService from "../../services/battle.service";
import * as engineGrpc from "../../grpc/generated/engine";
import * as battleGrpc from "../../grpc/generated/battle";
import * as aiGrpc from "../../grpc/generated/ai";
import logger from "@shared/logger";
import FrontBattleStreamRegistry from "../channels/front.battle.stream";
import * as profileService from "../../services/profile.service";
import {ErrorObject} from "../../grpc/generated/common/error";
import engineStream from "../../grpc/channels/engine.stream";
import {enqueueEvent} from "@shared/pg-boss/src/enqueueEvent";
import {kafkaProducersConfig} from "../../config/kafka.config";


export async function isAllowedUser(userId: string, profileId: string) {

  const profile = await profileService.getProfileByUser(userId);

  if (!profile) {
    throw new Error("Profile not found");
  }

  if (profile.id !== profileId) {
    throw new Error("Access deined");
  }
}

export async function battleHandler(ws: WebSocket, profileId: string, payload: streamingGrpc.BattleStreamRequest) {
  if (payload.join) {
    // logger.log("Battle join event");

    let battle: battleGrpc.BattleObject | null;
    if (payload.join.battleId) {
      battle = await battleService.joinBattle(payload.join.battleId, profileId);
    } else {
      battle = await battleService.upsertBattle(profileId);
    }

    if (!battle) {
      const error = ErrorObject.create({
        type: "error",
        message: "Battle not found"
      });
      const buffer = ErrorObject.encode(error).finish();
      ws.send(buffer);

      return;
    }

    FrontBattleStreamRegistry.setBattleStream(battle.id, profileId, ws);
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

    const battleId = FrontBattleStreamRegistry.getBattleIdByStream(ws);

    const grpcRequest = engineGrpc.BattleChannelClientEvent.create({
      move: engineGrpc.BattleMoveRequest.create({
        profileId: profileId,
        battleId: battleId,
        cellIdx: payload.move.cellIdx
      }),
    });

    engineStream.write(grpcRequest);
  }

  if (payload.ping) {
    // logger.log('ping from profile ' + FrontBattleStreamRegistry.getProfileIdByStream(ws));
    // logger.log('ping battle ' + FrontBattleStreamRegistry.getBattleIdByStream(ws));
    // FrontBattleStreamRegistry.writeDataStreams(battle.id, 'ping', {});
  }

  if (payload.connectAi) {
    const battleId = FrontBattleStreamRegistry.getBattleIdByStream(ws);
    const profileId = FrontBattleStreamRegistry.getProfileIdByStream(ws);
    const battleIdRequest = battleGrpc.JoinBattleRequest.create({battleId, profileId});
    logger.log('kafkaProducersConfig.topicAiConnectingRequest');
    await enqueueEvent(kafkaProducersConfig.topicAiConnectingRequest, battleIdRequest);
  }

  if (payload.leave) {
    const grpcRequest = engineGrpc.BattleChannelClientEvent.create({
      leave: engineGrpc.BattleLeaveRequest.create({
        battleId: FrontBattleStreamRegistry.getBattleIdByStream(ws),
        profileId,
      }),
    });

    engineStream.write(grpcRequest);
  }
}


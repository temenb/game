import type {WebSocket} from "ws";
import {BattleStreamRequest} from "../../grpc/generated/streaming";
import * as battleService from "../../services/battle.service";
import * as engineService from "../../services/engine.service";
import logger from "@shared/logger";
import BattleStreamRegistry from "../../channels/front.battle.stream";
import {ErrorObject} from "../../grpc/generated/common/error";
import * as ProfileClient from '../../grpc/clients/profile.client';
import {BattleObject} from "../../grpc/generated/battle";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import {ProfileService} from "../../grpc/generated/profile";
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

export async function battleHandler(ws: WebSocket, userId: string, payload: BattleStreamRequest) {

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
    BattleStreamRegistry.setBattleStream(battle.id, ws);
    logger.log("Battle stream was set:" + battle.id);
    BattleStreamRegistry.writeBattleStreams(battle);
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


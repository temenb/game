import * as streamingGrpc from "../grpc/generated/streaming";
import * as battleGrpc from "../grpc/generated/battle";
import battleClient from "../clients/battle.client";
import {boss} from "@shared/pg-boss";
import logger from "@shared/logger";
import {pgBossConsumersConfig} from "../config/pg.boss.config";
import {enqueueEvent} from "@shared/pg-boss/src/enqueueEvent";


export const startBattle = async (req: streamingGrpc.StartBattleRequest) => {
  const message = streamingGrpc.BattleStreamRequest.create({start: req});
  logger.log('startBattle');
  logger.log(pgBossConsumersConfig.websocketSendEvent.topic, message);
  await enqueueEvent(pgBossConsumersConfig.websocketSendEvent.topic, message);
}

export const makeMove = async (battle: battleGrpc.BattleObject) => {
  const cellIdx = 0;
  const battleId = battle.id;
  const req = streamingGrpc.BattleStreamRequest.create({move: streamingGrpc.BattleMoveRequest.create({battleId, cellIdx})});
  await enqueueEvent(pgBossConsumersConfig.websocketSendEvent.topic, req);
  logger.log('message moved to pgboss')
}

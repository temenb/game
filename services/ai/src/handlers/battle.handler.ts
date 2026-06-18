import * as streamingGrpc from "../grpc/generated/streaming";
import * as battleGrpc from "../grpc/generated/battle";
import battleClient from "../clients/battle.client";
import {boss} from "@shared/pg-boss";


export const startBattle = async (req: streamingGrpc.StartBattleRequest) => {
  battleClient.send(streamingGrpc.BattleStreamRequest.create({start: req}));
}

export const makeMove = async (battle: battleGrpc.BattleObject) => {
  const cellIdx = 0;
  const battleId = battle.id;
  const req = streamingGrpc.BattleStreamRequest.create({move: streamingGrpc.BattleMoveRequest.create({battleId, cellIdx})});
  await boss().publish('battle-send', { req });
  battleClient.send(req);
}

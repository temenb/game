import * as streamingGrpc from "../grpc/generated/streaming";
import * as battleGrpc from "../grpc/generated/battle";
import battleClient from "../clients/battle.client";


export const startBattle = async (req: streamingGrpc.StartBattleRequest) => {
  battleClient.send(streamingGrpc.BattleStreamRequest.create({start: req}));
}

export const makeMove = async (battle: battleGrpc.BattleObject) => {
  const cellIdx = 0;
  const req = streamingGrpc.BattleStreamRequest.create({move: {cellIdx}});
  battleClient.send(req);
}

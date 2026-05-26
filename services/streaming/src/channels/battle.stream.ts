import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../grpc/generated/battle';
import * as StreamingGrpc from '../grpc/generated/streaming';
import logger from "@shared/logger";

const battleStreams = new Map<
  string, Set<grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>>
>();

const callToBattle = new Map<
  grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>,
  string
>();


export const setBattleStream = (
  battleId: string,
  call: grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>
) => {
  if (!battleStreams.has(battleId)) {
    battleStreams.set(battleId, new Set());
  }
  battleStreams.get(battleId)!.add(call);

  callToBattle.set(call, battleId);



  call.on("end", () => {
    logger.error("End a stream");
    deleteBattleStream(call);
  });

  call.on("close", () => {
    logger.error("Close a stream");
    deleteBattleStream(call);
  });

  call.on("error", (err) => {
    logger.error("Stream error:", err);
    deleteBattleStream(call);
  });
};


export function deleteBattleStream(call: grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>): void;
export function deleteBattleStream(battleId: string): void;
export function deleteBattleStream(
  arg: grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject> | string
) {
  if (typeof arg === "string") {
    const battleId = arg;

    const streams = battleStreams.get(battleId);
    if (!streams) return;

    for (const stream of streams) {
      stream.end();
      callToBattle.delete(stream);
    }
    battleStreams.delete(battleId)
  } else {
    const call = arg;
    const battleId = callToBattle.get(call);
    if (!battleId) return;

    const streams = battleStreams.get(battleId);
    if (streams) {
      streams.delete(call);
      if (streams.size === 0) {
        battleStreams.delete(battleId);
      }
    }

    callToBattle.delete(call);
    call.end();
  }
}

export function getBattleStreams(
  battleId: string
): Set<grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>> | undefined
{
  return battleStreams.get(battleId);
}


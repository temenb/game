import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../grpc/generated/battle';
import * as StreamingGrpc from '../grpc/generated/streaming';
import logger from "@shared/logger";

export default class BattleStreamRegistry {
  private static battleStreams = new Map<
    string, Set<grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>>
  >();

  private static callToBattle = new Map<
    grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>,
    string
  >();

  private static heartbeatTimers = new Map<
    grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>,
    NodeJS.Timeout
  >();

  private static heartbeatTimeoutMs = 25000;

  static setBattleStream = (
    battleId: string,
    call: grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>
  ) => {
    if (!this.battleStreams.has(battleId)) {
      this.battleStreams.set(battleId, new Set());
    }
    this.battleStreams.get(battleId)!.add(call);

    this.callToBattle.set(call, battleId);

    logger.log('battleStreams keys:', this.battleStreams.keys());


    call.on("end", () => {
      logger.error("End a stream");
      call.end();
      // this.deleteBattleStream(call);
    });

    call.on("close", () => {
      logger.error("Close a stream");
      call.end();
      // this.deleteBattleStream(call);
    });

    call.on("error", (err) => {
      logger.error("Stream error:", err);
      call.end();
      // this.deleteBattleStream(call);
    });

    this.resetHeartbeat(call);

    // любое сообщение от клиента сбрасывает таймер
    call.on("data", () => this.resetHeartbeat(call));
  };


  static deleteBattleStream(call: grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>): void;
  static deleteBattleStream(battleId: string): void;
  static deleteBattleStream(
    arg: grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject> | string
  ) {
    if (typeof arg === "string") {
      const battleId = arg;

      const streams = this.battleStreams.get(battleId);
      if (!streams) return;

      for (const stream of streams) {
        stream.end();
        this.callToBattle.delete(stream);
      }
      this.battleStreams.delete(battleId)
    } else {
      const call = arg;
      const battleId = this.callToBattle.get(call);
      if (!battleId) return;

      const streams = this.battleStreams.get(battleId);
      if (streams) {
        streams.delete(call);
        if (streams.size === 0) {
          this.battleStreams.delete(battleId);
        }
      }

      this.callToBattle.delete(call);
      call.end();
    }
  }

  static getBattleStreams(
    battleId: string
  ): Set<grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>> | undefined {
    return this.battleStreams.get(battleId);
  }

  private static resetHeartbeat(call: grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>) {
    this.clearHeartbeat(call);
    const timer = setTimeout(() => {
      logger.warn("Heartbeat timeout, cleaning stream");
      this.deleteBattleStream(call);
    }, this.heartbeatTimeoutMs);
    this.heartbeatTimers.set(call, timer);
  }

  private static clearHeartbeat(call: grpc.ServerDuplexStream<StreamingGrpc.BattleStreamRequest, BattleGrpc.BattleObject>) {
    const timer = this.heartbeatTimers.get(call);
    if (timer) {
      clearTimeout(timer);
      this.heartbeatTimers.delete(call);
    }
  }

  static writeBattleStreams(battle: BattleGrpc.BattleObject) {
    const streams = BattleStreamRegistry.getBattleStreams(battle.id);
    if (!streams) {
      logger.log(`No active streams found for battleId=${battle.id}`, battle);
      throw new Error(`No active streams found for battleId=${battle.id}`);
    }


    logger.log('Update streams for battle: ' + battle.id, battle);
    logger.log('Streams count: ' + streams.size);
    let count = 0;
    for (const stream of streams) {
      logger.log('Streams update ' + ++count);

      stream.write(battle);
    }
  }
}

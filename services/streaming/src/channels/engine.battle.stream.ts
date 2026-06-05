import * as grpc from '@grpc/grpc-js';
import * as battleGrpc from '../grpc/generated/battle';
import * as streamingGrpc from '../grpc/generated/streaming';
import logger from "@shared/logger";

export default class EngineBattleStreamRegistry {
  private static battleStreams = new Map<
    string, Set<grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject>>
  >();

  private static callToBattle = new Map<
    grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject>,
    string
  >();

  private static heartbeatTimers = new Map<
    grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject>,
    NodeJS.Timeout
  >();

  private static heartbeatTimeoutMs = 25000;

  static setBattleStream = (
    battleId: string,
    call: grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject>
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


  static deleteBattleStream(call: grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject>): void;
  static deleteBattleStream(battleId: string): void;
  static deleteBattleStream(
    arg: grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject> | string
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
  ): Set<grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject>> | undefined {
    return this.battleStreams.get(battleId);
  }

  static writeBattleStreams(battle: battleGrpc.BattleObject) {
    const streams = EngineBattleStreamRegistry.getBattleStreams(battle.id);
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

  private static resetHeartbeat(call: grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject>) {
    this.clearHeartbeat(call);
    const timer = setTimeout(() => {
      logger.warn("Heartbeat timeout, cleaning stream");
      this.deleteBattleStream(call);
    }, this.heartbeatTimeoutMs);
    this.heartbeatTimers.set(call, timer);
  }

  private static clearHeartbeat(call: grpc.ServerDuplexStream<streamingGrpc.BattleStreamRequest, battleGrpc.BattleObject>) {
    const timer = this.heartbeatTimers.get(call);
    if (timer) {
      clearTimeout(timer);
      this.heartbeatTimers.delete(call);
    }
  }
}

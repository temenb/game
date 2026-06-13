import {WebSocket} from 'ws';
import * as battleGrpc from '../../grpc/generated/battle';
import * as emptyGrpc from '../../grpc/generated/common/empty';
import * as streamingGrpc from '../../grpc/generated/streaming';
import logger from "@shared/logger";

export default class FrontBattleStreamRegistry {
  private static battleStreams = new Map<string, Set<WebSocket>>();
  private static socketToBattle = new Map<WebSocket, string>();

  private static heartbeatTimers = new Map<
    WebSocket,
    NodeJS.Timeout
  >();

  private static heartbeatTimeoutMs = 360000;

  static setBattleStream = (
    battleId: string,
    socket: WebSocket
  ) => {
    if (!this.battleStreams.has(battleId)) {
      this.battleStreams.set(battleId, new Set());
    }
    this.battleStreams.get(battleId)!.add(socket);

    this.socketToBattle.set(socket, battleId);

    // logger.log('battleStreams keys:', this.battleStreams.keys());


    socket.on("close", () => {
      logger.error("Close a stream");
      this.deleteBattleStream(socket);
    });

    socket.on("error", (err) => {
      logger.error("Stream error:", err);
      this.deleteBattleStream(socket);
    });

    this.resetHeartbeat(socket);

    // любое сообщение от клиента сбрасывает таймер
    socket.on("message", () => this.resetHeartbeat(socket));
    logger.info("Stream is opened");

  };


  static deleteBattleStream(socket: WebSocket): void;
  static deleteBattleStream(battleId: string): void;
  static deleteBattleStream(
    arg: WebSocket | string
  ) {
    if (typeof arg === "string") {
      const battleId = arg;

      const streams = this.battleStreams.get(battleId);
      if (!streams) return;

      for (const stream of streams) {
        stream.close();
        this.socketToBattle.delete(stream);
      }
      this.battleStreams.delete(battleId)
    } else {
      const call = arg;
      const battleId = this.socketToBattle.get(call);
      if (!battleId) return;

      const streams = this.battleStreams.get(battleId);
      if (streams) {
        streams.delete(call);
        if (streams.size === 0) {
          this.battleStreams.delete(battleId);
        }
      }

      this.socketToBattle.delete(call);
      call.close();
    }
  }

  static getBattleStreams(
    battleId: string
  ): Set<WebSocket> | undefined {
    return this.battleStreams.get(battleId);
  }

  static encodeResponse(type: string, data?: any) {
    switch (type) {
      case 'battle':
        return streamingGrpc.BattleStreamResponse.encode({battle: data}).finish();
      case 'ping':
        return emptyGrpc.Empty.encode({}).finish();
      default:
        logger.error(`Unknown type: ${type}`);
        return undefined;
    }
  }

  static _writeBattleStreams(battleId: string, type: string, data: object) {
    const streams = FrontBattleStreamRegistry.getBattleStreams(battleId);
    if (!streams) {
      logger.log(`No active streams found for battleId=${battleId}`, data);
      throw new Error(`No active streams found for battleId=${battleId}`);
    }

    // logger.log('Update ' + type + ' streams for battle: ' + battleId, data);
    // logger.log('Streams count: ' + streams.size);
    let count = 0;
    for (const stream of streams) {
      // logger.log('Streams update ' + ++count);
      const buffer = FrontBattleStreamRegistry.encodeResponse(type, data);
      if (buffer) {
        stream.send(buffer);
      }
    }
  }

  static writeBattleStreams(battle: battleGrpc.BattleObject) {
    FrontBattleStreamRegistry._writeBattleStreams(battle.id, 'battle', battle);
  }

  static writeDataStreams(battleId: string, type: string, data: object) {
    FrontBattleStreamRegistry._writeBattleStreams(battleId, type, data);
  }

  private static resetHeartbeat(call: WebSocket) {
    this.clearHeartbeat(call);
    const timer = setTimeout(() => {
      logger.warn("Heartbeat timeout, cleaning stream");
      this.deleteBattleStream(call);
    }, this.heartbeatTimeoutMs);
    this.heartbeatTimers.set(call, timer);
  }

  private static clearHeartbeat(call: WebSocket) {
    const timer = this.heartbeatTimers.get(call);
    if (timer) {
      clearTimeout(timer);
      this.heartbeatTimers.delete(call);
    }
  }
}

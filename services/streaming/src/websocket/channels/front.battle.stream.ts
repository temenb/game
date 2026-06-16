import {WebSocket} from 'ws';
import * as streamingGrpc from '../../grpc/generated/streaming';
import logger from "@shared/logger";

export default class FrontBattleStreamRegistry {
  private static battleStreams = new Map<string, Set<WebSocket>>();
  private static socketToBattle = new Map<WebSocket, string>();
  private static socketToProfile = new Map<WebSocket, string>();
  private static socketEncodingType = new Map<WebSocket, string>();

  private static heartbeatTimers = new Map<
    WebSocket,
    NodeJS.Timeout
  >();

  private static heartbeatTimeoutMs = 360000;

  static setBattleStream = (
    battleId: string,
    profileId: string,
    socket: WebSocket
  ) => {
    if (!this.battleStreams.has(battleId)) {
      this.battleStreams.set(battleId, new Set());
    }
    this.battleStreams.get(battleId)!.add(socket);

    this.socketToBattle.set(socket, battleId);
    this.socketToProfile.set(socket, profileId);

    // logger.log('battleStreams keys:', this.battleStreams.keys());

    socket.on("close", () => {
      logger.info("Close a stream");

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

  static setSocketEncodingTypeToString(socket: WebSocket): void {
    this.socketEncodingType.set(socket, 'plain');
  }


  static socketEncodingTypeIsPlain(socket: WebSocket): boolean {
    return this.socketEncodingType.has(socket) && (this.socketEncodingType.get(socket) == 'plain');
  }

  static deleteBattleStream(arg: WebSocket | string): void {
    if (typeof arg === "string") {
      const battleId = arg;

      const streams = this.battleStreams.get(battleId);
      if (!streams) return;

      for (const stream of streams) {
        stream.close();
        this.socketToBattle.delete(stream);
        this.socketToProfile.delete(stream);
      }
      this.battleStreams.delete(battleId)
    } else {
      //@todo refactor this
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
      this.socketToProfile.delete(call);
      call.close();
      // call.end();
    }
  }

  static getBattleStreams(
    battleId: string
  ): Set<WebSocket> | undefined {
    return this.battleStreams.get(battleId);
  }

  static getBattleIdByStream(
    ws: WebSocket
  ): string | undefined {
    return this.socketToBattle.get(ws);
  }

  static getProfileIdByStream(
    ws: WebSocket
  ): string | undefined {
    return this.socketToProfile.get(ws);
  }


  static getStreams(arg: WebSocket | string): Set<WebSocket> {
    if (typeof arg === "string") {
      const battleId = arg;

      const streams = FrontBattleStreamRegistry.getBattleStreams(battleId);
      if (!streams) {
        logger.log(`No active streams found for battleId=${battleId}`);
        throw new Error(`No active streams found for battleId=${battleId}`);
      }
      return streams;
    } else if (arg instanceof WebSocket) {

      return new Set<WebSocket>([arg]);
    }
    throw new Error(`Smth went wrong`);
  }

  static writeBattleStreams(arg: WebSocket | string, streamRequest: streamingGrpc.BattleStreamResponse) {

    const streams = this.getStreams(arg);

    // logger.log('Update ' + type + ' streams for battle: ' + battleId, data);
    // logger.log('Streams count: ' + streams.size);
    for (const stream of streams) {
      // logger.log('Streams update ' + ++count);
      const buffer = this.socketEncodingTypeIsPlain(stream)
        ? JSON.stringify(streamRequest)
        : streamingGrpc.BattleStreamResponse.encode(streamRequest).finish();
      if (buffer) {
        stream.send(buffer);
      }
    }
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

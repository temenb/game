import {WebSocket} from 'ws';
import * as streamingGrpc from '../../grpc/generated/streaming';
import logger from "@shared/logger";

export default class FrontBattleStreamRegistry {
  private static sockets = new Set<WebSocket>();
  private static battleSockets = new Map<string, Set<WebSocket>>();
  private static socketBattles = new Map<WebSocket, Set<string>>();
  private static socketProfile = new Map<WebSocket, string>();
  private static socketEncodingType = new Map<WebSocket, string>();

  private static heartbeatTimers = new Map<
    WebSocket,
    NodeJS.Timeout
  >();

  private static heartbeatTimeoutMs = 360000;

  static getBattleIdsByStream = (ws: WebSocket): Set<string> => {
    return this.socketBattles.get(ws) ?? new Set<string>();
  }

  static setBattleStream = (
    ws: WebSocket,
    profileId: string,
    battleId: string
  ) => {
    this.sockets.add(ws);
    ws.on("close", () => {
      logger.info("Close a stream");

      this.deleteBattleStream(ws);
    });

    ws.on("error", (err) => {
      logger.error("Stream error:", err);
      this.deleteBattleStream(ws);
    });

    this.resetHeartbeat(ws);

    ws.on("message", () => this.resetHeartbeat(ws));
    logger.info("Stream is added to registry");

    if (!this.battleSockets.has(battleId)) {
      this.battleSockets.set(battleId, new Set());
    }

    this.battleSockets.get(battleId)!.add(ws);

    if (!this.socketBattles.has(ws)) {
      this.socketBattles.set(ws, new Set());
    }

    this.socketBattles.get(ws)!.add(battleId);

    this.battleSockets.get(battleId)!.add(ws);


    this.socketProfile.set(ws, profileId);
  };

  static setSocketEncodingTypeToString(socket: WebSocket): void {
    this.socketEncodingType.set(socket, 'plain');
  }

  static socketEncodingTypeIsPlain(socket: WebSocket): boolean {
    return this.socketEncodingType.has(socket) && (this.socketEncodingType.get(socket) == 'plain');
  }

  static deleteBattleStreams(battleId: string): void {
    const streams = FrontBattleStreamRegistry.getBattleStreams(battleId);
    if (!streams) return;

    for (const stream of streams) {
      this.deleteBattleStream(stream);
    }

    this.battleSockets.delete(battleId);
  }

  static deleteBattleStream(ws: WebSocket): void {
    this.sockets.delete(ws);



    const battleIds = this.getBattleIdsByStream(ws);

    for (const battleId of battleIds) {

      const set = this.battleSockets.get(battleId);
      if (set) {
        set.delete(ws);
        if (set.size === 0) {
          this.battleSockets.delete(battleId);
        }
      }
    }
    this.socketBattles.delete(ws)
    this.socketProfile.delete(ws)
    this.socketEncodingType.delete(ws);
  }

  static getBattleStreams(
    battleId: string
  ): Set<WebSocket> | undefined {
    return this.battleSockets.get(battleId);
  }

  static writeBattleStreams(battleId: string, streamRequest: streamingGrpc.BattleStreamResponse) {
    const streams = FrontBattleStreamRegistry.getBattleStreams(battleId);
    if (!streams) return;

    for (const stream of streams) {
      this.writeStream(stream, streamRequest);
    }
  }

  static writeStream(ws: WebSocket, streamRequest: streamingGrpc.BattleStreamResponse) {
    const buffer = this.socketEncodingTypeIsPlain(ws)
      ? JSON.stringify(streamRequest)
      : streamingGrpc.BattleStreamResponse.encode(streamRequest).finish();
    if (buffer) {
      ws.send(buffer);
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



import WebSocket from "ws";
import config from "../config/config";
import gatewayClient from "./gateway.client";
import * as streamingGrpc from "../grpc/generated/streaming";
import * as authGrpc from "../grpc/generated/auth";
import {AuthObject} from "../grpc/generated/auth";
import * as profileGrpc from "../grpc/generated/profile";
import logger from "@shared/logger";
import {ProfileObject} from "../grpc/generated/profile";

class BattleClient {
  private auth: authGrpc.AuthObject | null = null;
  private profile: profileGrpc.ProfileObject | null = null;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;

  async getAuth(): Promise<authGrpc.AuthObject> {
    if (this.auth) {
      // logger.info('this.auth', this.auth);
      return this.auth;
    }
    try {
      const response = await gatewayClient.signIn(config.deviceId);
      if (!response || (response as any).error) {
        logger.error("❌ Auth failed:", response);
        this.auth = null;
        throw new Error("Auth failed");
      }
      this.auth = response as authGrpc.AuthObject;
      return this.auth;
    } catch (err) {
      logger.error("❌ Auth error:", err);
      this.auth = null;
      throw err; // ошибка всплывает, но процесс не падает
    }
  }


  async getProfile(): Promise<profileGrpc.ProfileObject> {
    if (this.profile) return this.profile;
    try {
      const response = await gatewayClient.fetchProfile();

      if (!response || (response as any).error) {
        logger.error("❌ Profile failed:", response);
        this.auth = null;
        throw new Error("Profile failed");
      }
      this.profile = response as profileGrpc.ProfileObject;

      return this.profile;
    } catch (err) {
      logger.error("❌ Profile error:", err);
      this.profile = null;
      throw err; // ошибка всплывает, но процесс не падает
    }
  }

  async connect(messageHandler?: (data: WebSocket.RawData) => void): Promise<WebSocket | null> {
    if (this.ws) return this.ws;

    let auth: authGrpc.AuthObject;
    try {
      auth = await this.getAuth();
    } catch (err) {
      logger.error("❌ connection is refused.",);
      this.scheduleReconnect();
      return null;
    }

    let profile: profileGrpc.ProfileObject;
    try {
      profile = await this.getProfile();
    } catch (err) {
      logger.error("❌ connection is refused.",);
      this.scheduleReconnect();
      return null;
    }

    // logger.log(`ws://${config.webSocketStreaming}/battle?token=${auth.accessToken}&profileId=${profile.id}`);
    this.ws = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${auth.accessToken}&profileId=${profile.id}`);

    this.ws.on("message", messageHandler ?? this.defaultMessageHandler);
    this.ws.on("error", this.errorHandler);
    this.ws.on("close", this.closeHandler);

    logger.info("Battle stream was created",);
    this.reconnectAttempts = 0;
    return this.ws;
  }

  async join(battleId: string) {
    const ws = await this.connect();
    if (!ws) throw new Error('cannot send. stream is not opened.')
    const req = streamingGrpc.BattleStreamRequest.create({join: {battleId}});
    ws.send(streamingGrpc.BattleStreamRequest.encode(req).finish());
  }

  async makeMove(battleId: string, cellIdx: number) {
    const ws = await this.connect();
    if (!ws) throw new Error('cannot send. stream is not opened.')

    const req = streamingGrpc.BattleStreamRequest.create({move: {cellIdx}});
    ws.send(streamingGrpc.BattleStreamRequest.encode(req).finish());
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws.removeAllListeners();
      this.ws = null;
    }
    this.auth = null;
    this.profile = null;
    this.reconnectAttempts = 0;
  }

  private defaultMessageHandler(data: WebSocket.RawData) {
    try {
      const buffer = new Uint8Array(data as ArrayBuffer);
      const response = streamingGrpc.BattleStreamResponse.decode(buffer);
      logger.log("📩 Got response:", response);
    } catch (err) {
      logger.error("❌ Failed to parse message:", err);
    }
  }

  private errorHandler(err: unknown) {
    logger.error("⚠️ WebSocket error:", err);
  }

  private closeHandler = () => {
    logger.warn("❌ Connection closed");
    this.scheduleReconnect();
  };

  private scheduleReconnect() {
    this.disconnect();
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000); // экспоненциальная задержка, макс 30с
    logger.info("Schedule reconnect in " + (delay/1000));

    this.reconnectAttempts++;
    setTimeout(() => {
      logger.info(`🔄 Reconnecting... attempt ${this.reconnectAttempts}`);
      this.connect().catch(err => logger.error("Reconnect failed:", err));
    }, delay);
  }
}

const battleClient = new BattleClient();

export default battleClient;

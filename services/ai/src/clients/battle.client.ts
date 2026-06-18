import WebSocket from "ws";
import config from "../config/config";
import gatewayClient from "./gateway.client";
import * as streamingGrpc from "../grpc/generated/streaming";
import * as authGrpc from "../grpc/generated/auth";
import * as profileGrpc from "../grpc/generated/profile";
import logger from "@shared/logger";
import * as battleService from "../services/battle.service";

class BattleClient {
  private auth: authGrpc.AuthObject | null = null;
  private profile: profileGrpc.ProfileObject | null = null;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnecting = false;

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

  async connect(): Promise<WebSocket | null> {
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

    this.ws.on("message", this.messageHandler);
    this.ws.on("open", this.openHandler);
    this.ws.on("error", this.errorHandler);
    this.ws.on("close", this.closeHandler);

    logger.info("Battle stream was created",);
    return this.ws;
  }

  disconnect(reconnectAttempts = this.reconnectAttempts) {
    if (this.ws) {
      this.ws.close();
      this.ws.removeAllListeners();
      this.ws = null;
    }
    this.auth = null;
    this.profile = null;
    this.reconnectAttempts = reconnectAttempts;
  }


  send = (message: streamingGrpc.BattleStreamRequest) => {
    this.ws!.send(streamingGrpc.BattleStreamRequest.encode(message).finish());
  }

  private messageHandler(data: WebSocket.RawData) {
    try {
      const buffer = new Uint8Array(data as ArrayBuffer);
      const message = streamingGrpc.BattleStreamResponse.decode(buffer);
      logger.log("📩 Got response:", message);
      battleService.battleMessageHandler(message);
    } catch (err) {
      logger.error("❌ Failed to parse message:", err);
    }
  }

  private errorHandler = (err: unknown) => {
    logger.error("⚠️ WebSocket error:", err);
    this.scheduleReconnect();
  }

  private openHandler = () => {
    this.reconnectAttempts = 0;
    logger.info("✅ WebSocket connected");
  };

  private closeHandler = () => {
    logger.warn("❌ Connection closed");
    this.scheduleReconnect();
  };

  private scheduleReconnect() {
    if (this.reconnecting) return; // защита от дублей

    this.reconnecting = true;

    this.disconnect();
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    logger.info("Schedule reconnect in " + delay / 1000);

    this.reconnectAttempts++;
    setTimeout(async () => {
      logger.info(`🔄 Reconnecting... attempt ${this.reconnectAttempts}`);
      try {
        await this.connect();
        this.reconnecting = false; // сброс флага после успешного подключения
      } catch (err) {
        logger.error("Reconnect failed:", err);
        this.reconnecting = false; // сброс, чтобы можно было пробовать снова
        this.scheduleReconnect();  // запускаем новый цикл
      }
    }, delay);
  }

}

const battleClient = new BattleClient();

export default battleClient;

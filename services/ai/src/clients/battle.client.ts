import WebSocket from "ws";
import config from "../config/config";
import * as gatewayClient from "./auth.client";
import * as streamingGrpc from "../grpc/generated/streaming";
import * as authGrpc from "../grpc/generated/auth";
import * as profileGrpc from "../grpc/generated/profile";

class BattleClient {
  private auth: authGrpc.AuthObject | null = null;
  private profile: profileGrpc.ProfileObject | null = null;
  private ws: WebSocket | null = null;

  async getAuth(): Promise<authGrpc.AuthObject> {
    if (this.auth) return this.auth;
    this.auth = await gatewayClient.signIn(config.deviceId) as authGrpc.AuthObject;
    return this.auth;
  }

  async getProfile(): Promise<profileGrpc.ProfileObject> {
    if (this.profile) return this.profile;
    this.auth = await this.getAuth();
    this.profile = await gatewayClient.fetchProfile(this.auth) as profileGrpc.ProfileObject;
    return this.profile;
  }

  async connect(messageHandler?: (data: WebSocket.RawData) => void): Promise<WebSocket> {
    if (this.ws) return this.ws;
    const auth = await this.getAuth();
    this.ws = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${auth.accessToken}`);
    this.ws.on("message", messageHandler ?? this.defaultMessageHandler);
    this.ws.on("error", this.errorHandler);
    this.ws.on("close", this.closeHandler);
    return this.ws;
  }

  async join(battleId: string) {
    const ws = await this.connect();
    const profile = await this.getProfile();
    const req = streamingGrpc.BattleStreamRequest.create({join: {battleId, profileId: profile.id}});
    ws.send(streamingGrpc.BattleStreamRequest.encode(req).finish());
  }

  async makeMove(battleId: string, cellIdx: number) {
    const ws = await this.connect();
    const profile = await this.getProfile();
    const req = streamingGrpc.BattleStreamRequest.create({move: {battleId, profileId: profile.id, cellIdx}});
    ws.send(streamingGrpc.BattleStreamRequest.encode(req).finish());
  }

  private defaultMessageHandler(data: WebSocket.RawData) {
    try {
      const buffer = new Uint8Array(data as ArrayBuffer);
      const response = streamingGrpc.BattleStreamResponse.decode(buffer);
      console.log("📩 Got response:", response);
    } catch (err) {
      console.error("❌ Failed to parse message:", err);
    }
  }

  private errorHandler(err: unknown) {
    console.error("⚠️ WebSocket error:", err);
  }

  private closeHandler() {
    console.log("❌ Connection closed");
    // TODO: reconnect logic
  }
}

const battleClient = new BattleClient();

export default battleClient;

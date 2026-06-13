import WebSocket from "ws";
import config from "../../config/config";
import * as gatewayClient from "../../http/clients/gateway.client";
import * as streamingGrpc from "../../grpc/generated/streaming";
import * as battleGrpc from "../../grpc/generated/streaming";
import * as authGrpc from "../../grpc/generated/auth";
import * as profileGrpc from "../../grpc/generated/profile";

let authObject: authGrpc.AuthObject | null = null;
let profileObject: profileGrpc.ProfileObject | null = null;
let webSocket: WebSocket | null = null;

export const startWebSocket = async (): Promise<WebSocket> => {
  return await getWebSocket();
}

const getAuth = async (): Promise<authGrpc.AuthObject> => {
  if (authObject) {
    return authObject;
  }
  return (await gatewayClient.signIn(config.deviceId)) as authGrpc.AuthObject;
}

export const getProfile = async (): Promise<profileGrpc.ProfileObject> => {
  if (profileObject) {
    return profileObject;
  }
  authObject = await getAuth();
  return (await gatewayClient.fetchProfile(authObject)) as profileGrpc.ProfileObject;
}

export const getWebSocket = async (messageHandler?: (data: WebSocket.RawData) => void): Promise<WebSocket> => {
  if (webSocket) {
    return webSocket;
  }
  authObject = await getAuth();
  webSocket = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${authObject.accessToken}`);

  webSocket.on('message', messageHandler ?? defaultMessageHandler)
  webSocket.on('error', errorHandler)
  webSocket.on('close', closeHandler)

  return webSocket;
}

export const join = async (battleId: string) => {
  const ws = await getWebSocket();
  const profile = await getProfile();
  const req = streamingGrpc.BattleStreamRequest.create({join: {battleId, profileId: profile.id}});
  const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  await ws.send(buffer);
}

export const makeMove = async (battleId: string, cellIdx: number) => {
  const ws = await getWebSocket();
  const profile = await getProfile();
  const req = streamingGrpc.BattleStreamRequest.create({move: {battleId, profileId: profile.id, cellIdx}});
  const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  await ws.send(buffer);
}

const defaultMessageHandler = (data: battleGrpc.BattleStreamResponse) => {
  try {
    const buffer = new Uint8Array(data as ArrayBuffer);
    const response = streamingGrpc.BattleStreamResponse.decode(buffer);
    console.log("📩 Got response:", response);
    // здесь можно вызвать обработчик, например updateUI(response)
  } catch (err) {
    console.error("❌ Failed to parse message:", err);
  }
}

const errorHandler = (err: unknown) => {
  console.error("⚠️ WebSocket error:", err);
}

const closeHandler = () => {
  console.log("❌ Connection closed");
  // можно реализовать reconnect()
}

import * as gatewayClient from "../http/clients/gateway.client";
import config from "../config/config";
import * as authGrpc from "../grpc/generated/auth";
import * as profileGrpc from "../grpc/generated/profile";
import {WebSocket} from "ws";
import * as streamingHandler from "../websoket/handlers/streaming.handler";

let authObject: authGrpc.AuthObject | null = null;
let profileObject: profileGrpc.ProfileObject | null = null;
let webSocket: WebSocket | null = null;

export const getAuth = async (): Promise<authGrpc.AuthObject> => {
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
export const getWebSoket = async (): Promise<WebSocket> => {
  if (webSocket) {
    return webSocket;
  }
  authObject = await getAuth();
  webSocket = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${authObject.accessToken}`);
  webSocket.on('message', streamingHandler.messageHandler)
  webSocket.on('error', streamingHandler.errorHandler)
  webSocket.on('close', streamingHandler.closeHandler)

  return webSocket;
}





export const connectToBattle = async (battleId: string) => {

};
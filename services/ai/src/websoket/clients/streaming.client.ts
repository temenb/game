import config from "../../config/config";
import WebSocket from "ws";
import * as streamingGrpc from "../../grpc/generated/streaming";
import * as authGrpc from "../../grpc/generated/auth";

import * as gatewayClient from "../../http/clients/gateway.client";
import * as profileGrpc from "../../grpc/generated/profile";
import * as streamingHandler from "..//handlers/streaming.handler";

let authObject: authGrpc.AuthObject;
let profileObject: profileGrpc.ProfileObject;
let webSocket: WebSocket;

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
export const getWebSoket = (): WebSocket => {
  if (webSocket) {
    return webSocket;
  }
  authObject = await getAuth();
  webSocket = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${authObject.accessToken}`);
  webSocket.on('message', streamingHandler.messageHandler)
  webSocket.on('error', streamingHandler.errorHandler)
  webSocket.on('close', streamingHandler.closeHandler)
}

export const join = async () => {
  const req = streamingGrpc.BattleStreamRequest.create({join: {profileId: profileObject.id}});
  const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  await webSocket.send(buffer);
}

export const makeMove = async (battleId: string, cellIdx: number) => {
  const req = streamingGrpc.BattleStreamRequest.create({move: {battleId, profileId: profileObject.id, cellIdx}});
  const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  await webSocket.send(buffer);
}


export const connectToBattle = async (battleId: string) => {


};
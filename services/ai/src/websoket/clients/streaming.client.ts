import config from "../../config/config";
import http from "node:http";
import jwt from "jsonwebtoken";
import WebSocket from "ws";
import * as battleGrpc from "../../grpc/generated/battle";
import * as streamingGrpc from "../../grpc/generated/streaming";
import * as grpcAuthO from "../../grpc/generated/auth";

export const connect = async (accessToken: string) => {
  return new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${accessToken}`);

}

export const join = async (ws: WebSocket, profileId: string) => {
  const req = streamingGrpc.BattleStreamRequest.create({join: { profileId: profileId }});
  const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  await ws.send(buffer);
}

export const makeMove = async (ws: WebSocket, battleId: string, profileId: string, cellIdx: number) => {
  const req = streamingGrpc.BattleStreamRequest.create({move: { battleId, profileId, cellIdx}});
  const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  await ws.send(buffer);
}







export const connectToBattle = async (battleId: string, accessToken: string) => {



};
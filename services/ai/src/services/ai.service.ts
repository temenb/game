import {gatewayRequest} from "../http/clients/gateway.client";
import jwt from "jsonwebtoken";
import WebSocket from "ws";
import config from "../config/config";
import * as battleGrpc from "../grpc/generated/battle";
import * as streamingGrpc from "../grpc/generated/streaming";







export const connectToBattle = async (battleId: string) => {
  //
  // //------------------------------------------------------------------------------------------------------------------
  //
  // // await delay(5000);
  //
  // const profile1 = await gatewayRequest("profile/getMyProfile", {}, "GET", auth1.accessToken);
  // const profile2 = await gatewayRequest("profile/getMyProfile", {}, "GET", auth2.accessToken);
  //
  // console.log(profile1);
  //
  // const ws1 = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${auth1.accessToken}`);
  // const ws2 = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${auth2.accessToken}`);
  //
  //
  // const start = new Promise<void>(async (resolve) => {
  //   let counter = 0;
  //   const gameplay = async (battleObject?: battleGrpc.BattleObject | null) => {
  //     console.log(battleObject);
  //
  //     console.log('=====================================================================step ', counter);
  //     if (!battleObject) {
  //       const req = streamingGrpc.BattleStreamRequest.create({join: { profileId: profile1.id }});
  //       const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  //       ws1.send(buffer);
  //     } else if (counter === 1) {
  //       const req = streamingGrpc.BattleStreamRequest.create({join: { profileId: profile2.id }});
  //       const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  //       ws2.send(buffer);
  //     } else if (counter === 5) {
  //       const req = streamingGrpc.BattleStreamRequest.create({move: { battleId: battleObject.id, profileId: profile1.id, cellIdx: 4 }});
  //       const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  //       ws1.send(buffer);
  //     } else if (counter === 7) {
  //       const req = streamingGrpc.BattleStreamRequest.create({move: {battleId: battleObject.id, profileId: profile2.id, cellIdx: 1}});
  //       const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  //       ws2.send(buffer);
  //     } else if (counter === 9) {
  //       const req = streamingGrpc.BattleStreamRequest.create({move: { battleId: battleObject.id, profileId: profile1.id, cellIdx: 0 }});
  //       const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  //       ws1.send(buffer);
  //     } else if (counter === 11) {
  //       const req = streamingGrpc.BattleStreamRequest.create({move: {battleId: battleObject.id, profileId: profile2.id, cellIdx: 2}});
  //       const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  //       ws2.send(buffer);
  //     } else if (counter === 13) {
  //       const req = streamingGrpc.BattleStreamRequest.create({move: {battleId: battleObject.id, profileId: profile1.id, cellIdx: 8}});
  //       const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  //       ws1.send(buffer);
  //     } else if (counter >= 15) {
  //       resolve();
  //     }
  //     console.log("-------------------------------------------------------------------------------------------------------------------------------");
  //
  //     counter++;
  //   };
  //
  //
  //   ws1.on("message", (data: streamingGrpc.BattleStreamResponse) => {
  //     console.log("------------------------------------------------------------------------------=1=- Got battle update:");
  //     const buffer = new Uint8Array(data as ArrayBuffer);
  //     const res = streamingGrpc.BattleStreamResponse.decode(buffer);
  //
  //     // console.log(res)
  //     const battleObject = battleGrpc.BattleObject.create(res.battle);
  //
  //     gameplay(battleObject);
  //   });
  //
  //   ws2.on("message", (data: streamingGrpc.BattleStreamResponse) => {
  //     console.log("------------------------------------------------------------------------------=2=- Got battle update:");
  //     const buffer = new Uint8Array(data as ArrayBuffer);
  //     const res = streamingGrpc.BattleStreamResponse.decode(buffer);
  //
  //     // console.log(res);
  //     const battleObject = battleGrpc.BattleObject.create(res.battle);
  //     gameplay(battleObject);
  //   });
  //
  //   await Promise.all([
  //     new Promise(resolve => ws1.on('open', resolve)),
  //     new Promise(resolve => ws2.on('open', resolve)),
  //   ]);
  //
  //   await gameplay();
  // });
  //
  //
  // await start;
  //
  // ws1.close();
  // ws2.close();
  //
  //
  // ///
  // console.log('streams are closed')
  //


};
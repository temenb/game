import * as battleGrpc from "../../src/grpc/generated/battle";
import * as profileGrpc from "../../src/grpc/generated/profile";
import * as streamingGrpc from "../../src/grpc/generated/streaming";
import config from "../../src/config/config";
import jwt from "jsonwebtoken";
import WebSocket from "ws";
import * as http from "node:http";
import logger from "@shared/logger";
import {BattleStreamRequest} from "../../src/grpc/generated/streaming";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function gatewayRequest(uri: string, request: object, method?: string, jwt?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(request);

    let headers: Record<string, string | number> = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    };

    if (jwt) {
      headers["Authorization"] = "Bearer " + jwt;
    }

    if (!method) {
      method = 'GET';
    }

    const options = {
      hostname: config.httpGatewayHost,
      port: Number(config.httpGatewayPort),
      path: `/${uri}`,
      method: method,
      headers,
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          console.log(body);
          const response = JSON.parse(body);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(data);
    req.end();
  });
}

describe("Gateway Service", () => {

  test("Game story functional", async () => {

    const deviceId1 = `device1-${Math.random().toString(36).substring(2, 8)}`;
    const deviceId2 = `device2-${Math.random().toString(36).substring(2, 8)}`;

    console.log(deviceId1);
    console.log(deviceId2);

    const auth1 = await gatewayRequest("auth/anonymousSignIn", {deviceId: deviceId1}, "POST");
    const auth2 = await gatewayRequest("auth/anonymousSignIn", {deviceId: deviceId2}, "POST");


    console.log(auth1);
    console.log(auth2);
    expect(auth1).toBeDefined();
    expect(auth1.accessToken).toBeDefined();
    expect(auth2).toBeDefined();
    expect(auth2.accessToken).toBeDefined();

    const payload1 = jwt.decode(auth1.accessToken) as { sub: string; iat: number; exp: number };
    const payload2 = jwt.decode(auth2.accessToken) as { sub: string; iat: number; exp: number };
    expect(payload1.sub).toBeDefined();
    console.log('user1', payload1.sub);
    console.log('user2', payload2.sub);

    //------------------------------------------------------------------------------------------------------------------

    await delay(5000);

    const profile1 = await gatewayRequest("profile/getMyProfile", {}, "GET", auth1.accessToken);
    const profile2 = await gatewayRequest("profile/getMyProfile", {}, "GET", auth2.accessToken);

    console.log(profile1);

    const ws1 = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${auth1.accessToken}`);
    const ws2 = new WebSocket(`ws://${config.webSocketStreaming}/battle?token=${auth2.accessToken}`);


    const start = new Promise<void>(async (resolve) => {
      let counter = 0;
      const gameplay = async (battleObject?: battleGrpc.BattleObject | null) => {
        console.log(battleObject);

        console.log('=====================================================================step ', counter);
        if (!battleObject) {
          const req = streamingGrpc.BattleStreamRequest.create({join: { profileId: profile1.id }});
          const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
          ws1.send(buffer);
        } else if (counter === 1) {
          const req = streamingGrpc.BattleStreamRequest.create({join: { profileId: profile2.id }});
          const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
          ws2.send(buffer);
        } else if (counter === 5) {
          const req = streamingGrpc.BattleStreamRequest.create({move: { battleId: battleObject.id, profileId: profile1.id, cellIdx: 4 }});
          const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
          ws1.send(buffer);
        } else if (counter === 7) {
          const req = streamingGrpc.BattleStreamRequest.create({move: {battleId: battleObject.id, profileId: profile2.id, cellIdx: 1}});
          const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
          ws2.send(buffer);
        } else if (counter === 9) {
          const req = streamingGrpc.BattleStreamRequest.create({move: { battleId: battleObject.id, profileId: profile1.id, cellIdx: 0 }});
          const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
          ws1.send(buffer);
        } else if (counter === 11) {
          const req = streamingGrpc.BattleStreamRequest.create({move: {battleId: battleObject.id, profileId: profile2.id, cellIdx: 2}});
          const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
          ws2.send(buffer);
        } else if (counter === 13) {
          const req = streamingGrpc.BattleStreamRequest.create({move: {battleId: battleObject.id, profileId: profile1.id, cellIdx: 8}});
          const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
          ws1.send(buffer);
        } else if (counter >= 15) {
          resolve();
        }
        console.log("-------------------------------------------------------------------------------------------------------------------------------");

        counter++;
      };


      ws1.on("message", (data: streamingGrpc.BattleStreamResponse) => {
        console.log("------------------------------------------------------------------------------=1=- Got battle update:");
        const buffer = new Uint8Array(data as ArrayBuffer);
        const res = streamingGrpc.BattleStreamResponse.decode(buffer);

        // console.log(res)
        const battleObject = battleGrpc.BattleObject.create(res.battle);

        gameplay(battleObject);
      });

      ws2.on("message", (data: streamingGrpc.BattleStreamResponse) => {
        console.log("------------------------------------------------------------------------------=2=- Got battle update:");
        const buffer = new Uint8Array(data as ArrayBuffer);
        const res = streamingGrpc.BattleStreamResponse.decode(buffer);

        // console.log(res);
        const battleObject = battleGrpc.BattleObject.create(res.battle);
        gameplay(battleObject);
      });

      await Promise.all([
        new Promise(resolve => ws1.on('open', resolve)),
        new Promise(resolve => ws2.on('open', resolve)),
      ]);

      await gameplay();
    });


    await start;

    ws1.close();
    ws2.close();


    ///
    console.log('streams are closed')


    // });
  }, 30000);

});






import * as battleGrpc from "../../src/grpc/generated/battle";
import config from "../../src/config/config";
import jwt from "jsonwebtoken";
import WebSocket from "ws";
import * as http from "node:http";

async function gatewayRequest(uri: string, request: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(request);

    const options = {
      hostname: config.httpGatewayHost,
      port: Number(config.httpGatewayPort),
      path: `/${uri}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
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

    const auth1 = await gatewayRequest("auth/anonymousSignIn", {deviceId: deviceId1});
    const auth2 = await gatewayRequest("auth/anonymousSignIn", {deviceId: deviceId2});


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

    const ws1 = new WebSocket(`ws://${config.webSocketStreaming}?token=${auth1.accessToken}`);
    const ws2 = new WebSocket(`ws://${config.webSocketStreaming}?token=${auth2.accessToken}`);


    const start = new Promise<void>(async (resolve) => {
      let counter = 0;
      const gameplay = async (battleObject?: battleGrpc.BattleObject | null) => {
        console.log(battleObject);

        console.log('=====================================================================step ', counter);
        if (!battleObject) {
          ws1.send(JSON.stringify({type: "battle", payload: {join: {}}}));
        } else if (counter === 1) {
          ws2.send(JSON.stringify({type: "battle", payload: {join: {}}}));
        } else if (counter === 5) {
          ws1.send(JSON.stringify({
            type: "battle",
            payload: {move: {battleId: battleObject.id, userId: payload1.sub, cellIdx: 4}}
          }));
        } else if (counter === 7) {
          ws2.send(JSON.stringify({
            type: "battle",
            payload: {move: {battleId: battleObject.id, userId: payload2.sub, cellIdx: 1}}
          }));
        } else if (counter === 9) {
          ws1.send(JSON.stringify({
            type: "battle",
            payload: {move: {battleId: battleObject.id, userId: payload1.sub, cellIdx: 0}}
          }));
        } else if (counter === 11) {
          ws2.send(JSON.stringify({
            type: "battle",
            payload: {move: {battleId: battleObject.id, userId: payload2.sub, cellIdx: 2}}
          }));
        } else if (counter === 13) {
          ws1.send(JSON.stringify({
            type: "battle",
            payload: {move: {battleId: battleObject.id, userId: payload1.sub, cellIdx: 8}}
          }));
        } else if (counter > 14) {
          resolve();
        }
        console.log("-------------------------------------------------------------------------------------------------------------------------------");

        counter++;
      };


      ws1.on("message", (data: battleGrpc.BattleObject) => {
        console.log("------------------------------------------------------------------------------=1=- Got battle update:");
        const battleObject = JSON.parse(data.toString()).payload.message;
        gameplay(battleObject);
      });

      ws2.on("message", (data: battleGrpc.BattleObject) => {
        console.log("------------------------------------------------------------------------------=2=- Got battle update:");
        const battleObject = JSON.parse(data.toString()).payload.message;
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
  }, 20000);

});






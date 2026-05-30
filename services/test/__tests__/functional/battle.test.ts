import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from "../../src/grpc/generated/auth";
import * as BattleGrpc from "../../src/grpc/generated/battle";
import * as GatewayGrpc from "../../src/grpc/generated/gateway";
import config from "../../src/config/config";
import jwt from "jsonwebtoken";
import WebSocket from "ws";
import {GatewayClient} from "../../src/grpc/generated/gateway";
import {StreamingClient} from "../../src/grpc/generated/streaming";



describe("Gateway Service", () => {

  let gatewayClient: GatewayClient;
  let streamingClient: StreamingClient;

  function callUnary<TReq, TRes>(
    fn: (req: TReq, cb: (err: grpc.ServiceError | null, res?: TRes) => void) => void,
    req: TReq
  ): Promise<TRes> {
    return new Promise((resolve, reject) => {
      fn(req, (err, res) => {
        if (err) reject(err);
        else resolve(res!);
      });
    });
  }

  beforeAll(async () => {
    gatewayClient = new GatewayGrpc.GatewayClient('gateway:' + config.grpcPort, grpc.credentials.createInsecure());
  });

  afterAll(async () => {
    streamingClient.close();
    gatewayClient.close();
  });

  // test("Channel test", async () => {
  //
  //   const deviceId = `device-${Math.random().toString(36).substring(2, 8)}`;
  //   const grpcRequest: AuthGrpc.AnonymousSignInRequest = {deviceId: deviceId};
  //
  //   const auth: AuthGrpc.AuthObject = await callUnary(
  //     gatewayClient.anonymousSignIn.bind(gatewayClient),
  //     grpcRequest
  //   );
  //
  //   if (!auth) {
  //     fail('AuthObject shouldn\'t be null');
  //   }
  //
  //   //------------------------------------------------------------------------------------------------------------------
  //   expect(auth).toBeDefined();
  //
  //   const payload = jwt.decode(auth.accessToken) as { sub: string; iat: number; exp: number };
  //   expect(payload.sub).toBeDefined();
  //
  //   const accessPayload = jwt.decode(auth.accessToken) as any;
  //   const refreshPayload = jwt.decode(auth.refreshToken) as any;
  //
  //   expect(accessPayload.sub).toBeDefined();
  //   expect(refreshPayload.sub).toBeDefined();
  //   expect(accessPayload.sub).not.toHaveLength(0);
  //   expect(refreshPayload.sub).not.toHaveLength(0);
  //
  //   //------------------------------------------------------------------------------------------------------------------
  //
  //   const metadata = new grpc.Metadata();
  //   metadata.add("authorization", `Bearer ${auth.accessToken}`);
  //
  //   const stream = streamingClient.battleChannel(metadata);
  //
  //   stream.write({ join: {} });
  //
  //   stream.on("data", (battleObject: BattleGrpc.BattleObject) => {
  //     console.log("Got battle update:", battleObject);
  //   });
  //
  //   stream.on("error", (err: grpc.ServiceError) => {
  //     console.error("Battle stream error:", err);
  //   });
  //
  //   stream.on("end", () => {
  //     console.log("Battle stream ended");
  //   });
  //
  //
  //   stream.end();
  //   await new Promise(resolve => stream.on("finish", resolve));
  //
  //
  // });

  test("Game story functional", async () => {

    const deviceId1 = `device-${Math.random().toString(36).substring(2, 8)}`;
    const deviceId2 = `device-${Math.random().toString(36).substring(2, 8)}`;
    const grpcRequest1: AuthGrpc.AnonymousSignInRequest = {deviceId: deviceId1};
    const grpcRequest2: AuthGrpc.AnonymousSignInRequest = {deviceId: deviceId2};

    let counter = 0;

    const auth1: AuthGrpc.AuthObject = await callUnary(
      gatewayClient.anonymousSignIn.bind(gatewayClient),
      grpcRequest1
    );
    const auth2: AuthGrpc.AuthObject = await callUnary(
      gatewayClient.anonymousSignIn.bind(gatewayClient),
      grpcRequest2
    );

    if (!auth1 || !auth2) {
      fail('AuthObject shouldn\'t be null');
    }

    //------------------------------------------------------------------------------------------------------------------
    expect(auth1).toBeDefined();

    const payload1 = jwt.decode(auth1.accessToken) as { sub: string; iat: number; exp: number };
    const payload2 = jwt.decode(auth2.accessToken) as { sub: string; iat: number; exp: number };
    expect(payload1.sub).toBeDefined();
    console.log('user1', payload1.sub);
    console.log('user2', payload2.sub);

    //------------------------------------------------------------------------------------------------------------------

    const ws1 = new WebSocket(`ws://streaming:${config.webSocketPort}?token=${auth1.accessToken}`);
    const ws2 = new WebSocket(`ws://streaming:${config.webSocketPort}?token=${auth2.accessToken}`);



    const start = new Promise<void>(async (resolve) => {

      const gameplay = async (battleObject?: BattleGrpc.BattleObject | null) => {
        console.log('=====================================================================step', counter);
        if (!battleObject) {
          ws1.send(JSON.stringify({ type: "battle", payload: { join: {} } }));
        } else if (counter === 1) {
          ws2.send(JSON.stringify({ type: "battle", payload: { join: {} } }));
        } else if (counter === 5) {
          ws1.send(JSON.stringify({ type: "battle", payload: { move: { battleId: battleObject.id, userId: payload1.sub, cellIdx: 4 } } }));
        } else if (counter === 7) {
          ws2.send(JSON.stringify({ type: "battle", payload: { move: { battleId: battleObject.id, userId: payload2.sub, cellIdx: 1 } } }));
        } else if (counter === 9) {
          ws1.send(JSON.stringify({ type: "battle", payload: { move: { battleId: battleObject.id, userId: payload1.sub, cellIdx: 0 } } }));
        } else if (counter === 11) {
          ws2.send(JSON.stringify({ type: "battle", payload: { move: { battleId: battleObject.id, userId: payload2.sub, cellIdx: 2 } } }));
        } else if (counter === 13) {
          ws1.send(JSON.stringify({ type: "battle", payload: { move: { battleId: battleObject.id, userId: payload1.sub, cellIdx: 8 } } }));
        } else if (counter > 14) {
          resolve();
        }
        console.log("-------------------------------------------------------------------------------------------------------------------------------");

        counter++;
      };


      ws1.on("message", (data: BattleGrpc.BattleObject) => {
        console.log("------------------------------------------------------------------------------=1=- Got battle update:", battleObject);
        const battleObject = JSON.parse(data.toString());
        gameplay(battleObject);
      });

      ws2.on("message", (data: BattleGrpc.BattleObject) => {
        console.log("------------------------------------------------------------------------------=2=- Got battle update:", battleObject);
        const battleObject = JSON.parse(data.toString());
        gameplay(battleObject);
      });

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






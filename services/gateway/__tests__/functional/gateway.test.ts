import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from "../../src/grpc/generated/auth";
import * as BattleGrpc from "../../src/grpc/generated/battle";
import * as GatewayGrpc from "../../src/grpc/generated/gateway";
import * as StreamingGrpc from "../../src/grpc/generated/streaming";
import config from "../../src/config/config";
import jwt from "jsonwebtoken";
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
    streamingClient = new StreamingGrpc.StreamingClient(config.serviceStreamingUrl, grpc.credentials.createInsecure());
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
    expect(payload1.sub).toBeDefined();
    console.log('user1', payload1.sub);

    //------------------------------------------------------------------------------------------------------------------

    const metadata1 = new grpc.Metadata();
    metadata1.add("authorization", `Bearer ${auth1.accessToken}`);

    const stream1 = streamingClient.battleChannel(metadata1);

    stream1.on("error", (err: grpc.ServiceError) => {
      console.error("-=1=- Battle stream error:", err);
    });

    stream1.on("end", () => {
      console.log("-=1=- Battle stream ended");
    });




    const metadata2 = new grpc.Metadata();
    metadata2.add("authorization", `Bearer ${auth2.accessToken}`);
    const payload2 = jwt.decode(auth2.accessToken) as { sub: string; iat: number; exp: number };
    console.log('user2', payload2.sub);


    const stream2 = streamingClient.battleChannel(metadata2);

    stream2.on("error", (err: grpc.ServiceError) => {
      console.error("-=2=- Battle stream error:", err);
    });

    stream2.on("end", () => {
      console.log("-=2=- Battle stream ended");
    });


    const start = new Promise<void>(async (resolve) => {
      stream1.on("data", (battleObject: BattleGrpc.BattleObject) => {
        console.log("------------------------------------------------------------------------------=1=- Got battle update:", battleObject);
        gameplay(battleObject);
      });

      stream2.on("data", (battleObject: BattleGrpc.BattleObject) => {
        console.log("------------------------------------------------------------------------------=2=- Got battle update:", battleObject);
        gameplay(battleObject);
      });

      const gameplay = async (battleObject?: BattleGrpc.BattleObject | null) => {
        console.log('=====================================================================step', counter);
        if (!battleObject) {
          stream1.write({ join: {} });
        } else if (1 == counter) {
          stream2.write({ join: {} });
        } else if (5 == counter) {
          console.log("-=1=- Player move:", battleObject);
          stream1.write({ move: {battleId: battleObject.id, userId: payload1.sub, cellIdx: 4} });
        } else if (7 == counter) {
          console.log("-=2=- Player move:", battleObject);
          stream2.write({ move: {battleId: battleObject.id, userId: payload2.sub, cellIdx: 1} });
        } else if (9 == counter) {
          console.log("-=1=- Player move:", battleObject);
          stream1.write({ move: {battleId: battleObject.id, userId: payload1.sub, cellIdx: 0} });
        } else if (11 == counter) {
          console.log("-=2=- Player move:", battleObject);
          stream2.write({ move: {battleId: battleObject.id, userId: payload2.sub, cellIdx: 2} });
        } else if (13 == counter) {
          console.log("-=1=- Player move:", battleObject);
          stream1.write({ move: {battleId: battleObject.id, userId: payload1.sub, cellIdx: 8} });
        } else if (14 < counter) {
          resolve();
        }
        console.log("-------------------------------------------------------------------------------------------------------------------------------");

        counter++;
      };

      await gameplay();
    });

    await start;

    console.log("EXIT");

    stream1.end();

    stream2.end();

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('streams are closed')


    // });
  }, 20000);

});






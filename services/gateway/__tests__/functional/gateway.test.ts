import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from "../../src/grpc/generated/auth";
import * as BattleGrpc from "../../src/grpc/generated/battle";
import * as EmptyGrpc from "../../src/grpc/generated/common/empty";
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

  test("Golden Hammer", async () => {

    const deviceId1 = `device-${Math.random().toString(36).substring(2, 8)}`;
    const deviceId2 = `device-${Math.random().toString(36).substring(2, 8)}`;
    const grpcRequest1: AuthGrpc.AnonymousSignInRequest = {deviceId: deviceId1};
    const grpcRequest2: AuthGrpc.AnonymousSignInRequest = {deviceId: deviceId2};

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

    const payload = jwt.decode(auth1.accessToken) as { sub: string; iat: number; exp: number };
    expect(payload.sub).toBeDefined();

    const accessPayload = jwt.decode(auth1.accessToken) as any;
    const refreshPayload = jwt.decode(auth1.refreshToken) as any;

    expect(accessPayload.sub).toBeDefined();
    expect(refreshPayload.sub).toBeDefined();
    expect(accessPayload.sub).not.toHaveLength(0);
    expect(refreshPayload.sub).not.toHaveLength(0);

    //------------------------------------------------------------------------------------------------------------------

    const metadata1 = new grpc.Metadata();
    metadata1.add("authorization", `Bearer ${auth1.accessToken}`);
    const metadata2 = new grpc.Metadata();
    metadata2.add("authorization", `Bearer ${auth2.accessToken}`);

    const stream1 = streamingClient.battleChannel(metadata1);

    stream1.write({ join: {} });

    await new Promise(resolve => setTimeout(resolve, 1000));
    stream1.on("data", (battleObject: BattleGrpc.BattleObject) => {
      console.log("Got battle update:", battleObject);
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    stream1.on("error", (err: grpc.ServiceError) => {
      console.error("Battle stream error:", err);
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    stream1.on("end", () => {
      console.log("Battle stream ended");
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    stream1.end();
    await new Promise(resolve => setTimeout(resolve, 1000));

//    const stream2 = streamingManager.call((client, cb) => client.battleChannel(metadata2));


  // });
  }, 20000);

});






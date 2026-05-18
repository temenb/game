import AuthGrpc from "../../src/grpc/generated/auth";
import GatewayGrpc from "../../src/grpc/generated/gateway";
import * as grpc from '@grpc/grpc-js';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const gatewayManager = new GrpcClientManager<GatewayGrpc.GatewayClient>(() => {
  return new GatewayGrpc.GatewayGrpc.GatewayClient('127.0.0.1', grpc.credentials.createInsecure());
});

describe("Gateway Service", () => {

  test("AnonymousSignIn returns tokens", async () => {

    const deviceId = `device-${Math.random().toString(36).substring(2, 8)}`;
    const grpcRequest: AuthGrpc.AnonymousSignInRequest = {deviceId};

    const response = await new Promise((resolve, reject) => {
      gatewayManager.anonymousSignIn(grpcRequest, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    expect(response.getAccessToken()).toContain(deviceId);
    expect(response.getRefreshToken()).toContain(deviceId);
  });
});

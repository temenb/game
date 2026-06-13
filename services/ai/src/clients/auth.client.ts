import config from "../config/config";
import http from "node:http";
import * as grpcAuth from "../grpc/generated/auth";

export async function gatewayRequest(uri: string, request: object, method?: string, jwt?: string): Promise<any> {
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

export const signIn = async (deviceId: string) => await gatewayRequest("auth/anonymousSignIn", {deviceId}, "POST");

export const fetchProfile = async (auth: grpcAuth.AuthObject) => await gatewayRequest("profile/getMyProfile", {}, "GET", auth.accessToken);

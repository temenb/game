import config from "../config/config";
import http from "node:http";
import * as grpcAuth from "../grpc/generated/auth";

class GatewayClient {
  private host = config.httpGatewayHost;
  private port = Number(config.httpGatewayPort);

  private async request(
    uri: string,
    request: object,
    method: string = "GET",
    jwt?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(request);

      const headers: Record<string, string | number> = {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      };

      if (jwt) {
        headers["Authorization"] = "Bearer " + jwt;
      }

      const options = {
        hostname: this.host,
        port: this.port,
        path: `/${uri}`,
        method,
        headers,
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

      req.on("error", (err) => {
        if ((err as NodeJS.ErrnoException).code === "ECONNREFUSED") {
          reject(new Error(`Gateway unavailable at ${this.host}:${this.port}`));
        } else {
          reject(err);
        }
      });

      if (method !== "GET") {
        req.write(data);
      }
      req.end();
    });
  }

  async signIn(deviceId: string): Promise<grpcAuth.AuthObject> {
    return this.request("auth/anonymousSignIn", { deviceId }, "POST") as Promise<grpcAuth.AuthObject>;
  }

  async fetchProfile(auth: grpcAuth.AuthObject): Promise<any> {
    return this.request("profile/getMyProfile", {}, "GET", auth.accessToken);
  }
}

const gatewayClient = new GatewayClient();
export default gatewayClient;

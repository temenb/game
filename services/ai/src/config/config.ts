const [host, portStr] = (process.env.HTTP_GATEWAY || "gateway:8080").split(":");
const httpGatewayHost = host || "gateway";
const httpGatewayPort = Number(portStr) || 8080;
const httpGateway = httpGatewayHost + ':' + httpGatewayPort;


export const config = {
  httpGatewayHost: httpGatewayHost,
  httpGatewayPort: httpGatewayPort,
  httpGateway: httpGateway,
  webSocketStreaming: process.env.WEBSOCKET_STREAMING,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your_access_secret",
};

export default config;



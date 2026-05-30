
const [httpGatewayHost, httpGatewayPort] = (process.env.HTTP_GATEWAY || "gateway:8080").split(":");
export const config = {
  httpGatewayHost: httpGatewayHost || 'gateway',
  httpGatewayPort: httpGatewayPort || 8080,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your_access_secret",
};

export default config;



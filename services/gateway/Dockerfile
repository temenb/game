FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY services/gateway/package*.json ./services/gateway/
COPY services/gateway/jest.config.js ./services/gateway/
COPY services/gateway/tsconfig.json ./services/gateway/
COPY services/gateway/src ./services/gateway/src/
COPY services/auth/prisma ./services/auth/prisma/
COPY services/gateway/__tests__ ./services/gateway/__tests__/

USER root

RUN corepack enable && pnpm install
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000
EXPOSE 5000

CMD ["pnpm", "--filter", "gateway", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

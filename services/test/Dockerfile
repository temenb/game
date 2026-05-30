FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app/

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY services/test/package*.json ./services/test/
COPY services/test/jest.config.js ./services/test/
COPY services/test/tsconfig.json ./services/test/
COPY services/test/src ./services/test/src/
COPY services/test/__tests__ ./services/test/__tests__/
COPY services/test/.env ./services/test/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "test", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1

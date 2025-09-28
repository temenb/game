FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app/

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY services/server/package*.json ./services/server/
COPY services/server/jest.config.js ./services/server/
COPY services/server/tsconfig.json ./services/server/
COPY services/server/src ./services/server/src/
COPY services/server/prisma ./services/server/prisma/
COPY services/server/__tests__ ./services/server/__tests__/
COPY services/server/.env ./services/server/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN cd /usr/src/app/services/server && npx prisma generate
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["pnpm", "--filter", "server", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1

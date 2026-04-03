FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY services/spawner/package*.json ./services/spawner/
COPY services/spawner/jest.config.js ./services/spawner/
COPY services/spawner/tsconfig.json ./services/spawner/
COPY services/spawner/src ./services/spawner/src/
COPY services/spawner/prisma ./services/spawner/prisma/
COPY services/spawner/__tests__ ./services/spawner/__tests__/
COPY services/spawner/.env ./services/spawner/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN cd /usr/src/app/services/spawner && npx prisma generate
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["pnpm", "--filter", "spawner", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1

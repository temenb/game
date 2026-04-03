FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY services/spawn/package*.json ./services/spawn/
COPY services/spawn/jest.config.js ./services/spawn/
COPY services/spawn/tsconfig.json ./services/spawn/
COPY services/spawn/src ./services/spawn/src/
COPY services/spawn/prisma ./services/spawn/prisma/
COPY services/spawn/__tests__ ./services/spawn/__tests__/
COPY services/spawn/.env ./services/spawn/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN cd /usr/src/app/services/spawn && npx prisma generate
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["pnpm", "--filter", "spawn", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1

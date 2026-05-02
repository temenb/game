FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY services/gameBoard/package*.json ./services/gameBoard/
COPY services/gameBoard/jest.config.js ./services/gameBoard/
COPY services/gameBoard/tsconfig.json ./services/gameBoard/
COPY services/gameBoard/src ./services/gameBoard/src/
COPY services/gameBoard/prisma ./services/gameBoard/prisma/
COPY services/gameBoard/__tests__ ./services/gameBoard/__tests__/
COPY services/gameBoard/.env ./services/gameBoard/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN cd /usr/src/app/services/gameBoard && npx prisma generate
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "gameBoard", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1

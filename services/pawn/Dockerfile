FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY services/pawn/package*.json ./services/pawn/
COPY services/pawn/jest.config.js ./services/pawn/
COPY services/pawn/tsconfig.json ./services/pawn/
COPY services/pawn/src ./services/pawn/src/
COPY services/pawn/prisma ./services/pawn/prisma/
COPY services/pawn/__tests__ ./services/pawn/__tests__/
COPY services/pawn/.env ./services/pawn/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN cd /usr/src/app/services/pawn && npx prisma generate
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "pawn", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1

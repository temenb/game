FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app/

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY services/fallout/package*.json ./services/fallout/
COPY services/fallout/jest.config.js ./services/fallout/
COPY services/fallout/tsconfig.json ./services/fallout/
COPY services/fallout/src ./services/fallout/src/
COPY services/fallout/prisma ./services/fallout/prisma/
COPY services/fallout/__tests__ ./services/fallout/__tests__/
COPY services/fallout/.env ./services/fallout/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN cd /usr/src/app/services/fallout && npx prisma generate
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["pnpm", "--filter", "fallout", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1

FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY services/asteroid/package*.json ./services/asteroid/
COPY services/asteroid/jest.config.js ./services/asteroid/
COPY services/asteroid/tsconfig.json ./services/asteroid/
COPY services/asteroid/src ./services/asteroid/src/
COPY services/asteroid/prisma ./services/asteroid/prisma/
COPY services/asteroid/__tests__ ./services/asteroid/__tests__/
COPY services/asteroid/.env ./services/asteroid/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["pnpm", "--filter", "asteroid", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1

FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY services/ship/package*.json ./services/ship/
COPY services/ship/jest.config.js ./services/ship/
COPY services/ship/tsconfig.json ./services/ship/
COPY services/ship/src ./services/ship/src/
COPY services/ship/prisma ./services/ship/prisma/
COPY services/ship/__tests__ ./services/ship/__tests__/
COPY services/ship/.env ./services/ship/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN cd /usr/src/app/services/ship && npx prisma generate
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["pnpm", "--filter", "ship", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1

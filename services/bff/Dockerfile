FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app/

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY services/bff/package*.json ./services/bff/
COPY services/bff/jest.config.js ./services/bff/
COPY services/bff/tsconfig.json ./services/bff/
COPY services/bff/src ./services/bff/src/
COPY services/bff/prisma ./services/bff/prisma/
COPY services/bff/__tests__ ./services/bff/__tests__/
COPY services/bff/.env ./services/bff/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN cd /usr/src/app/services/bff && npx prisma generate
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "bff", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1

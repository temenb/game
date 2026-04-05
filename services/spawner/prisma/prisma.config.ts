import { defineConfig } from '@prisma/client';

export default defineConfig({
  datasource: {
    db: {
      provider: 'postgresql',
      // либо напрямую, либо через env
      url: process.env.DATABASE_URL!,
    },
  },
});

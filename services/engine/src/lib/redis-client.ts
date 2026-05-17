import Redis from "ioredis";

let redis: Redis | null = null;

export async function initRedis(
  host: string = process.env.REDIS_HOST || "localhost",
  port: number = Number(process.env.REDIS_PORT) || 6379
): Promise<void> {
  if (redis) return; // уже инициализирован

  redis = new Redis({ host, port });

  return new Promise<void>((resolve, reject) => {
    redis!.on("connect", () => {
      console.log("🟢 Redis connected");
      resolve();
    });

    redis!.on("error", (err) => {
      console.error("❌ Redis error", err);
      reject(err);
    });
  });
}

export function getRedis(): Redis {
  if (!redis) {
    throw new Error("Redis not initialized. Call initRedis() first.");
  }
  return redis;
}

export async function shutdownRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log("🛑 Redis connection closed");
  }
}

import { Redis } from "ioredis";

var redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!redis) {
    const redisUri = process.env.REDIS_URI;

    if (!redisUri) {
      console.error("REDIS_URI environment variable is required");

      return null;
    }

    redis = new Redis(redisUri);
  }

  return redis;
}

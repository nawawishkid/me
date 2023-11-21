import { Redis } from "ioredis";

var redis: Redis;

export function getRedis(): Redis {
  if (!redis) {
    const redisUri = process.env.REDIS_URI;

    if (!redisUri)
      throw new Error("REDIS_URI environment variable is required");

    redis = new Redis(redisUri);
  }

  return redis;
}

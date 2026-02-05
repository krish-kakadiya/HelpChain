import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

redis.connect()
  .then(() => console.log("Redis connected"))
  .catch(err => console.error("Redis Error:", err));

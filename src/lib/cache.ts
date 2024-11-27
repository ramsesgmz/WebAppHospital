import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
})

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    return await redis.get(key)
  },

  async set(key: string, value: any, expireIn?: number) {
    await redis.set(key, value, { ex: expireIn })
  },

  async invalidate(key: string) {
    await redis.del(key)
  }
} 
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
})

export async function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'
  const key = `rate_limit:${ip}`
  
  const current = await redis.incr(key)
  if (current === 1) {
    await redis.expire(key, 60) // 1 minuto
  }

  if (current > 100) { // 100 requests por minuto
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  return NextResponse.next()
} 
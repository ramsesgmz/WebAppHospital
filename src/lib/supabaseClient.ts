import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

class SupabaseService {
  private static instance: SupabaseService
  private client
  private retryCount = 3
  private timeout = 10000

  private constructor() {
    this.client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'x-application-name': 'hospital-webapp',
        },
      },
    })
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService()
    }
    return SupabaseService.instance
  }

  async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError
    for (let i = 0; i < this.retryCount; i++) {
      try {
        return await Promise.race([
          operation(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), this.timeout)
          )
        ]) as T
      } catch (error) {
        lastError = error
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
      }
    }
    throw lastError
  }

  getClient() {
    return this.client
  }
}

export const supabase = SupabaseService.getInstance().getClient() 
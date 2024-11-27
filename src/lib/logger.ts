import { supabase } from './supabaseClient'
import { captureException } from './sentry'

export const logger = {
  async info(message: string, data?: any) {
    try {
      await supabase.from('logs').insert({
        level: 'info',
        message,
        data
      })
    } catch (error) {
      console.error('Logging failed:', error)
    }
  },

  async error(error: Error, context?: any) {
    captureException(error, { extra: context })
    try {
      await supabase.from('logs').insert({
        level: 'error',
        message: error.message,
        data: {
          stack: error.stack,
          context
        }
      })
    } catch (logError) {
      console.error('Error logging failed:', logError)
    }
  }
} 
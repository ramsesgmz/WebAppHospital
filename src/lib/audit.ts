import { supabase } from './supabaseClient'
import { captureException } from './sentry'

export const auditLog = async (
  action: string,
  userId: string,
  details: Record<string, any>
) => {
  try {
    await supabase.from('audit_logs').insert({
      action,
      user_id: userId,
      details,
      ip_address: request?.headers?.['x-forwarded-for'] || 'unknown',
      user_agent: request?.headers?.['user-agent'] || 'unknown'
    })
  } catch (error) {
    captureException(error)
  }
} 
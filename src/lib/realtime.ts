import { supabase } from './supabase'

export const setupRealtimeSubscriptions = (userId: string) => {
  const notifications = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Nueva notificación:', payload)
        // Aquí implementar la lógica de notificación
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(notifications)
  }
} 
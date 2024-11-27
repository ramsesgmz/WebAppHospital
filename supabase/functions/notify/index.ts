import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { type, record } = await req.json()

    if (type === 'INSERT' && record?.assigned_to) {
      // Notificar nueva tarea asignada
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: record.assigned_to,
          type: 'task_assigned',
          data: {
            task_id: record.id,
            task_title: record.title
          }
        })
    }

    return new Response(
      JSON.stringify({ message: 'Notification sent' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 
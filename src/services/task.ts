import { supabase } from '@/lib/supabaseClient'
import type { Task } from '@/types/task'

export const taskService = {
  async createTask(task: Partial<Task>) {
    return await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()
  },

  async getTasks(filters?: Partial<Task>) {
    const query = supabase
      .from('tasks')
      .select('*, assigned_to(full_name, email)')
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query.eq(key, value)
      })
    }
    
    return await query
  },

  async updateTask(id: string, updates: Partial<Task>) {
    return await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  }
} 
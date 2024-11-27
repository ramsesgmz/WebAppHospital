import { supabase } from '@/lib/supabaseClient'
import { cache } from '@/lib/cache'
import { auditLog } from '@/lib/audit'

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  min_quantity: number
  unit: string
  category: string
}

export const inventoryService = {
  async getItems(category?: string) {
    const cacheKey = `inventory:${category || 'all'}`
    const cached = await cache.get<InventoryItem[]>(cacheKey)
    
    if (cached) return { data: cached, error: null }

    const query = supabase
      .from('inventory')
      .select('*')
    
    if (category) {
      query.eq('category', category)
    }

    const { data, error } = await query
    
    if (data) {
      await cache.set(cacheKey, data, 300) // cache por 5 minutos
    }

    return { data, error }
  },

  async updateQuantity(id: string, quantity: number, userId: string) {
    const { data, error } = await supabase
      .from('inventory')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single()

    if (data) {
      await auditLog('inventory:update', userId, {
        item_id: id,
        new_quantity: quantity
      })
      await cache.invalidate(`inventory:all`)
      await cache.invalidate(`inventory:${data.category}`)
    }

    return { data, error }
  }
}

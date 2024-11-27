import { supabase } from '@/src/lib/supabase'
import type { UserProfile } from '@/src/types/auth'

export const profileService = {
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
  },

  async getProfile(userId: string) {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  }
} 
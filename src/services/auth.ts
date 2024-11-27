import { supabase } from '../lib/supabase'
import type { UserProfile } from '../types/auth'

export const authService = {
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  },

  async signUp(email: string, password: string, role: UserProfile['role'], userData: Partial<UserProfile>) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { role, ...userData }
      }
    })

    if (authError) return { error: authError }

    // Crear perfil en la tabla profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          role,
          ...userData
        }
      ])

    return { data: authData, error: profileError }
  },

  async resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
  },

  async updatePassword(newPassword: string) {
    return supabase.auth.updateUser({ password: newPassword })
  },

  async signOut() {
    return supabase.auth.signOut()
  }
}
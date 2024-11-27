'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import type { UserProfile } from '@/src/types/auth'
import { profileService } from '@/src/services/profile'
import { captureException } from '@/src/lib/sentry'

type Permission = 'create:task' | 'edit:profile' | 'delete:inventory' | 'manage:users'

interface AuthState {
  user: UserProfile | null
  permissions: Permission[]
  loading: boolean
}

type AuthContextType = AuthState & {
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  hasPermission: (permission: Permission) => boolean
  logout: () => Promise<void>
}

const getPermissionsByRole = (role: UserProfile['role']): Permission[] => {
  switch (role) {
    case 'admin':
      return ['create:task', 'edit:profile', 'delete:inventory', 'manage:users']
    case 'enterprise':
      return ['create:task', 'edit:profile']
    default:
      return []
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  permissions: [],
  loading: true,
  updateProfile: async () => {},
  hasPermission: () => false,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    permissions: [],
    loading: true,
  })

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setState({
        user: null,
        permissions: [],
        loading: false,
      })
    } catch (error) {
      captureException(error as Error)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!state.user || !state.permissions.includes('edit:profile')) {
        throw new Error('No tienes permisos para editar perfiles')
      }
      
      const { data, error } = await profileService.updateProfile(
        state.user.id, 
        updates
      )
      
      if (error) throw error
      
      if (data) {
        setState(prev => ({
          ...prev,
          user: data,
          permissions: getPermissionsByRole(data.role),
        }))
      }
    } catch (error) {
      captureException(error as Error)
      throw error
    }
  }

  const hasPermission = (permission: Permission): boolean => {
    return state.permissions.includes(permission)
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setState({
            user: data,
            permissions: getPermissionsByRole(data.role),
            loading: false
          })
        } else {
          setState({
            user: null,
            permissions: [],
            loading: false
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      updateProfile,
      hasPermission,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
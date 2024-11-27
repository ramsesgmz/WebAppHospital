export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'enterprise' | 'user'
  created_at: string
  updated_at: string
}

export type Permission = 'create:task' | 'edit:profile' | 'delete:inventory' | 'manage:users'

export interface AuthResponse {
  data: {
    user: UserProfile | null
    session: any | null
  } | null
  error: Error | null
}
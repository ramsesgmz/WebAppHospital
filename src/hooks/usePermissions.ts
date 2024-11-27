import { useAuth } from '@/src/contexts/AuthContext'

export function usePermissions() {
  const { user } = useAuth()

  return {
    isAdmin: user?.role === 'admin',
    isEnterprise: user?.role === 'enterprise',
    isUser: user?.role === 'user',
    
    canManageInventory: user?.role === 'admin',
    canViewInventory: ['admin', 'enterprise'].includes(user?.role || ''),
    
    canManageUsers: user?.role === 'admin',
    canViewUsers: ['admin', 'enterprise'].includes(user?.role || ''),
    
    canManageSchedule: ['admin', 'enterprise'].includes(user?.role || ''),
    canViewSchedule: true,
    
    canManageAssignments: ['admin', 'enterprise'].includes(user?.role || ''),
    canViewAssignments: true
  }
}
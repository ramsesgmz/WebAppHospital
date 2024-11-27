import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

const TestComponent = () => {
  const { user, hasPermission } = useAuth()
  return (
    <div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="has-admin">{hasPermission('manage:users').toString()}</div>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('user-email').textContent).toBe('')
    expect(screen.getByTestId('has-admin').textContent).toBe('false')
  })

  it('should update permissions when user role changes', async () => {
    const mockUser = {
      id: '123',
      email: 'test@test.com',
      role: 'admin'
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Simular login
    await waitFor(() => {
      expect(screen.getByTestId('has-admin').textContent).toBe('true')
    })
  })
}) 
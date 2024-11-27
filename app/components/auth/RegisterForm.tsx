'use client'
import { useState } from 'react'
import { authService } from '@/src/services/auth'
import { useRouter } from 'next/navigation'
import type { UserRole } from '@/src/types/auth'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' as UserRole,
    area: '',
    enterprise: '',
    shift: '' as 'A' | 'B' | 'C' | ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await authService.signUp(
        formData.email, 
        formData.password,
        formData.role,
        {
          name: formData.name,
          area: formData.area,
          enterprise: formData.enterprise,
          shift: formData.shift || undefined
        }
      )
      
      if (error) throw error
      router.push('/auth/verify-email')
    } catch (err) {
      setError('Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text">Nombre completo</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          className="input input-bordered w-full"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Contraseña</span>
        </label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={formData.password}
          onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required
          minLength={6}
        />
      </div>

      {error && <p className="text-error">{error}</p>}

      <button 
        type="submit" 
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  )
}
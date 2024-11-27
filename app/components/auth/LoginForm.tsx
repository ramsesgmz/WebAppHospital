'use client'
import { useState } from 'react'
import { authService } from '@/src/services/auth'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await authService.signIn(formData.email, formData.password)
      if (error) throw error
      router.push('/dashboard')
    } catch (err) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>

      {error && <p className="text-error">{error}</p>}

      <button 
        type="submit" 
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}
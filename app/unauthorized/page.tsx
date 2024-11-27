'use client'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Acceso No Autorizado
        </h1>
        <p className="text-gray-600 mb-8">
          No tienes permisos para acceder a esta página
        </p>
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}
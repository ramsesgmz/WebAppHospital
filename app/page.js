'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/auth/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold">Redirigiendo...</h1>
      </div>
    </div>
  )
}

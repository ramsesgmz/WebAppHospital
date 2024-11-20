'use client'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '../shared/componentes/navbar'

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isAuthenticated = true
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
'use client'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from './componentes/navbar'

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (!userRole || (userRole !== 'admin' && userRole !== 'enterprise')) {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
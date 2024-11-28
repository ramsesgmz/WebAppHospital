'use client'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from './componentes/navbar'

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    setUserRole(userRole);
    if (!userRole || !['admin', 'enterprise', 'usuario'].includes(userRole)) {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isEnterprise={userRole === 'enterprise'} />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
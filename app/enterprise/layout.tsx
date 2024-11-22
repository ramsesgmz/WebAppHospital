'use client'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '../shared/componentes/navbar'
import ChatWidget from '../shared/componentes/ChatWidget'
import Image from 'next/image';

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (!userRole) {
      router.push('/auth/login')
      return
    }
    
    if (userRole !== 'enterprise') {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isEnterprise={true} />
      <main className="flex-1">
        {children}
      </main>
      <ChatWidget 
        isAdmin={true}
        onNewMessage={(message) => {
          console.log('Nuevo mensaje:', message)
        }}
      />
    </div>
  )
}
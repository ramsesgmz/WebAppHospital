'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../shared/componentes/navbar'
import ChatWidget from '../shared/componentes/ChatWidget'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (!userRole) {
      router.push('/auth/login')
      return
    }
    
    if (userRole !== 'admin') {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-6">
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
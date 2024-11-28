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
    if (!userRole || userRole !== 'admin') {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6">
          {children}
        </div>
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
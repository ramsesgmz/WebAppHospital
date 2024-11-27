'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import ChatWidget from '../components/ChatWidget'
import { supabase } from '@/src/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
      }
    }
    checkAuth()
  }, [router])

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Inventario', href: '/admin/inventory' },
    { name: 'Calendario', href: '/admin/schedule' },
    { name: 'Asignaciones', href: '/admin/assignments' },
    { name: 'Enterprise', href: '/admin/enterprise' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
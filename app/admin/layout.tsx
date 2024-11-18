'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import ChatWidget from '../components/ChatWidget'

export default function AdminLayout({
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

  const navigation = [
    { name: 'Inventario', href: '/admin/inventory' },
    { name: 'Calendario', href: '/admin/schedule' },
  ]

  return (
    <div>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-4 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {children}
      <ChatWidget 
        isAdmin={true}
        onNewMessage={(message) => {
          // Aquí manejaremos los nuevos mensajes
          console.log('Nuevo mensaje:', message)
        }}
      />
    </div>
  )
}
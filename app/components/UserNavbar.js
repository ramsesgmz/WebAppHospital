'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function UserNavbar() {
    const pathname = usePathname()

    const navigation = [
        { name: 'Tareas', href: '/user/taskHistory' },
        { name: 'Tarea Actual', href: '/user/currentTask' },
        { name: 'Reportes', href: '/user/reports' }
    ]

    return (
        <header className="bg-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Image
                                src="/logo.jpg"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        pathname === item.href
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
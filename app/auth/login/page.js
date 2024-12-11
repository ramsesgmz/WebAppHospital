'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { toast } from 'react-hot-toast'
import { calculateDistance } from './DynamicMap'
import { FaUser, FaLock } from 'react-icons/fa'
import { BsBuilding } from 'react-icons/bs'

const Map = dynamic(() => import('./DynamicMap'), { 
  ssr: false, 
  loading: () => <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">Cargando mapa...</div>
})

const LoginPage = () => {
    const router = useRouter()
    const gpsSimulatorRef = useRef(null)
    
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        showPassword: false
    })

    const [locationState, setLocationState] = useState({
        showMap: false,
        userLocation: null,
        showConfirmation: false,
        error: '',
        isLoading: false
    })

    const workArea = {
        lat: 9.0000000,
        lng: -79.5000000,
        radius: 10000
    }

    const simulateGPSPosition = useCallback(() => {
        // Simular una posición muy cercana al centro del área de trabajo
        return {
            coords: {
                latitude: workArea.lat + 0.0001,  // Muy cerca del punto central
                longitude: workArea.lng + 0.0001   // Muy cerca del punto central
            }
        }
    }, [workArea])

    useEffect(() => {
        return () => {
            gpsSimulatorRef.current = null
        }
    }, [])

    useEffect(() => {
        // Limpiar la sesión al cargar la página de login
        localStorage.removeItem('userRole')
    }, [])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()

        try {
            if (formState.username === 'usuario' && formState.password === '123456') {
                // 1. Primero guardamos las credenciales
                localStorage.setItem('userRole', 'usuario')
                localStorage.setItem('isAuthenticated', 'true')
                
                // 2. Establecemos las cookies
                document.cookie = `userRole=usuario; path=/; max-age=86400; secure; samesite=strict`;
                document.cookie = `isAuthenticated=true; path=/; max-age=86400; secure; samesite=strict`;
                
                // 3. Esperamos a que se establezcan los datos
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // 4. Redirigimos usando replace en lugar de push
                router.replace('/user/usuario')
                
                // 5. Mostramos el mensaje de éxito
                toast.success('Bienvenido Usuario')
            } 
            else if (formState.username === 'admin' && formState.password === '123456') {
                localStorage.setItem('userRole', 'admin')
                localStorage.setItem('isAuthenticated', 'true')
                document.cookie = `userRole=admin; path=/; max-age=86400; secure; samesite=strict`;
                document.cookie = `isAuthenticated=true; path=/; max-age=86400; secure; samesite=strict`;
                router.push('/admin/dashboard')
                toast.success('Bienvenido Administrador')
            } 
            else if (formState.username === 'enterprise' && formState.password === '123456') {
                localStorage.setItem('userRole', 'enterprise')
                localStorage.setItem('isAuthenticated', 'true')
                document.cookie = `userRole=enterprise; path=/; max-age=86400; secure; samesite=strict`;
                document.cookie = `isAuthenticated=true; path=/; max-age=86400; secure; samesite=strict`;
                router.push('/enterprise/dashboard')
                toast.success('Bienvenido Enterprise')
            }
            else {
                throw new Error('Usuario o contraseña incorrectos')
            }
        } catch (error) {
            console.error('Error en login:', error)
            toast.error(error.message || 'Error al iniciar sesión')
        }
    }, [formState, router])

    const handleMapConfirmation = useCallback(() => {
        if (locationState.showConfirmation) {
            router.push('/user/usuario')
            toast.success('Ubicación confirmada correctamente')
        }
    }, [locationState.showConfirmation, router])

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
             style={{
                 background: 'linear-gradient(150deg, #2563eb 0%, #1e40af 100%)'
             }}>
            {/* Ondas decorativas unificadas */}
            <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute bottom-0 w-full h-[80vh] opacity-10" 
                     viewBox="0 0 1440 320" 
                     preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
                            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.2)' }} />
                            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
                        </linearGradient>
                    </defs>
                    <path fill="url(#gradient)" 
                          d="M0,160L48,165.3C96,171,192,181,288,197.3C384,213,480,235,576,218.7C672,203,768,149,864,149.3C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                </svg>
            </div>

            {/* Contenido principal */}
            <div className="relative w-full max-w-2xl">
                {/* Panel azul de fondo */}
                <div className="absolute inset-0 bg-blue-600/90 
                              rounded-3xl shadow-xl">
                    <div className="p-12 text-white">
                        <h1 className="text-3xl font-bold mb-4">
                            Sistema de gestión y control de servicios
                        </h1>
                        <div className="flex items-center text-white space-x-2">
                            <BsBuilding className="w-5 h-5" />
                            <span>Gestión profesional de servicios</span>
                        </div>
                    </div>
                </div>

                {/* Panel celeste claro degradado */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-blue-200
                              rounded-3xl shadow-lg">
                </div>

                {/* Panel blanco principal */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-12">
                    <div className="w-full max-w-lg mx-auto">
                        <div className="mb-10">
                            <Image
                                src="/logo.jpg"
                                alt="Hombres de Blanco"
                                width={140}
                                height={140}
                                className="mx-auto"
                                priority
                            />
                        </div>

                        <h2 className="text-3xl font-bold text-blue-700 mb-3 text-center">
                            Bienvenido a
                            <br />
                            <span className="text-4xl mt-2 block font-extrabold text-blue-800">
                                HOMBRES DE BLANCO
                            </span>
                        </h2>
                        <p className="text-gray-500 text-center mb-10">
                            Ingresa tus credenciales para continuar
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-lg" />
                                <input
                                    type="text"
                                    value={formState.username}
                                    onChange={(e) => setFormState(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-base
                                             focus:border-blue-500 focus:ring-1 focus:ring-blue-200
                                             transition-all duration-200"
                                    placeholder="usuario"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-lg" />
                                <input
                                    type={formState.showPassword ? 'text' : 'password'}
                                    value={formState.password}
                                    onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-base
                                             focus:border-blue-500 focus:ring-1 focus:ring-blue-200
                                             transition-all duration-200"
                                    placeholder="••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-sm
                                             hover:text-blue-700 transition-colors duration-200"
                                >
                                    {formState.showPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-500 text-white rounded-lg text-lg font-semibold
                                         hover:bg-blue-600 transition-colors duration-200"
                            >
                                Iniciar Sesión
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <a href="#" className="text-blue-500 text-sm hover:underline">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage


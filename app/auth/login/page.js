'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { toast } from 'react-hot-toast'
import { calculateDistance } from './DynamicMap'
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa'
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

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Primero verificamos si es admin principal
            if (formState.username === 'admin_principal' && formState.password === 'admin123') {
                try {
                    localStorage.setItem('adminPrincipal', 'true');
                    localStorage.setItem('userRole', 'admin');
                    localStorage.setItem('adminId', '1');
                    document.cookie = `userRole=admin; path=/; max-age=86400; secure; samesite=strict`;
                    document.cookie = `adminPrincipal=true; path=/; max-age=86400; secure; samesite=strict`;
                    toast.success('Bienvenido Administrador Principal');
                    await router.push('/admin/dashboard');
                    return;
                } catch (error) {
                    console.error('Error en redirección:', error);
                    throw new Error('Error al iniciar sesión como admin principal');
                }
            }

            // Resto de las validaciones existentes
            if (formState.username === 'usuario' && formState.password === '123456') {
                // Simular obtención de ubicación
                const position = await new Promise((resolve) => {
                    resolve(simulateGPSPosition())
                })

                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }

                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    workArea.lat,
                    workArea.lng
                )

                if (distance <= workArea.radius) {
                    setLocationState(prev => ({
                        ...prev,
                        userLocation,
                        showMap: true,
                        showConfirmation: true,
                        isLoading: false
                    }))
                    localStorage.setItem('userRole', 'usuario')
                    document.cookie = `userRole=usuario; path=/; max-age=86400; secure; samesite=strict`;
                } else {
                    throw new Error('Debes estar dentro del área de trabajo para iniciar sesión')
                }
            } else if (formState.username === 'admin' && formState.password === '123456') {
                localStorage.setItem('userRole', 'admin')
                localStorage.setItem('isAuthenticated', 'true')
                localStorage.setItem('adminId', '3')
                document.cookie = `userRole=admin; path=/; max-age=86400; secure; samesite=strict`;
                document.cookie = `isAuthenticated=true; path=/; max-age=86400; secure; samesite=strict`;
                await router.push('/admin/dashboard')
                toast.success('Bienvenido Administrador')
            } else if (formState.username === 'enterprise' && formState.password === '123456') {
                localStorage.setItem('userRole', 'enterprise')
                localStorage.setItem('isAuthenticated', 'true')
                document.cookie = `userRole=enterprise; path=/; max-age=86400; secure; samesite=strict`;
                document.cookie = `isAuthenticated=true; path=/; max-age=86400; secure; samesite=strict`;
                await router.push('/enterprise/dashboard')
                toast.success('Bienvenido Enterprise')
            } else {
                throw new Error('Credenciales incorrectas')
            }
        } catch (error) {
            console.error('Error en login:', error)
            setLocationState(prev => ({ ...prev, error: error.message, isLoading: false }))
            toast.error(error.message || 'Error al iniciar sesión')
        } finally {
            setLocationState(prev => ({ ...prev, isLoading: false }))
        }
    }, [formState, router])

    const handleMapConfirmation = useCallback(() => {
        if (locationState.showConfirmation) {
            router.push('/user/usuario')
            toast.success('Ubicación confirmada correctamente')
        }
    }, [locationState.showConfirmation, router])

    return (
        <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
            {/* Ondas decorativas mejoradas */}
            <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute bottom-0 w-full h-[80vh] opacity-15" 
                     viewBox="0 0 1440 320" 
                     preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.4)' }} />
                            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.2)' }} />
                            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.4)' }} />
                        </linearGradient>
                    </defs>
                    <path fill="url(#gradient)" 
                          d="M0,160L48,165.3C96,171,192,181,288,197.3C384,213,480,235,576,218.7C672,203,768,149,864,149.3C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                          className="transition-all duration-300 ease-in-out hover:opacity-75">
                    </path>
                </svg>
            </div>

            {/* Contenido principal */}
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto my-4 md:my-8 px-4 animate-fadeIn">
                {/* Panel azul de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 to-blue-700/95 rounded-2xl md:rounded-3xl shadow-2xl backdrop-blur-sm">
                    <div className="p-6 md:p-8 lg:p-12 text-white">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 tracking-tight">
                            Sistema de gestión y control de servicios
                        </h1>
                        <div className="flex items-center text-white/90 space-x-2">
                            <BsBuilding className="w-4 h-4 lg:w-5 lg:h-5" />
                            <span className="text-sm lg:text-base font-light">Gestión profesional de servicios</span>
                        </div>
                    </div>
                </div>

                {/* Panel celeste claro degradado */}
                <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl md:rounded-3xl shadow-lg opacity-95">
                </div>

                {/* Panel blanco principal */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-300">
                    <div className="w-full max-w-md mx-auto">
                        <div className="mb-6 md:mb-10 transform transition-transform duration-300 hover:scale-105">
                            <Image
                                src="/logo.jpg"
                                alt="Hombres de Blanco"
                                width={100}
                                height={100}
                                className="mx-auto w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl shadow-lg"
                                priority
                            />
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700 mb-2 md:mb-3 text-center tracking-tight">
                            Bienvenido a
                            <br />
                            <span className="text-3xl sm:text-4xl lg:text-5xl mt-1 md:mt-2 block font-extrabold text-blue-800 tracking-tight">
                                HOMBRES DE BLANCO
                            </span>
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base text-center mb-6 md:mb-10 font-light">
                            Ingresa tus credenciales para continuar
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="relative group">
                                <FaUser className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-blue-500 text-lg transition-colors group-hover:text-blue-600" />
                                <input
                                    type="text"
                                    value={formState.username}
                                    onChange={(e) => setFormState(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 border border-gray-200 rounded-xl text-sm md:text-base
                                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50
                                             transition-all duration-200 bg-white/75 backdrop-blur-sm
                                             hover:border-blue-400"
                                    placeholder="usuario"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <FaLock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-blue-500 text-lg transition-colors group-hover:text-blue-600" />
                                <input
                                    type={formState.showPassword ? 'text' : 'password'}
                                    value={formState.password}
                                    onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 border border-gray-200 rounded-xl text-sm md:text-base
                                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50
                                             transition-all duration-200 bg-white/75 backdrop-blur-sm
                                             hover:border-blue-400"
                                    placeholder="••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-blue-500 text-xs md:text-sm
                                             hover:text-blue-700 transition-all duration-200 opacity-75 hover:opacity-100"
                                >
                                    {formState.showPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-base md:text-lg font-semibold
                                         hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]
                                         focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                                         disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed
                                         shadow-lg hover:shadow-xl flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Cargando...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 md:mt-8 text-center">
                            <a href="#" className="text-blue-500 text-xs md:text-sm hover:text-blue-700 hover:underline transition-colors duration-200">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {/* Mapa para verificación de ubicación */}
                        {locationState.showMap && (
                            <div className="mt-4 md:mt-6 space-y-3 md:space-y-4 animate-fadeIn">
                                <div className="w-full h-48 sm:h-56 md:h-64 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50 backdrop-blur-sm">
                                    <Map 
                                        userLocation={locationState.userLocation}
                                        workArea={workArea}
                                        onConfirm={handleMapConfirmation}
                                        showConfirmation={locationState.showConfirmation}
                                    />
                                </div>
                                {locationState.showConfirmation && (
                                    <button
                                        onClick={handleMapConfirmation}
                                        className="w-full py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-base md:text-lg font-semibold
                                                 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02]
                                                 focus:ring-2 focus:ring-green-400 focus:ring-offset-2
                                                 shadow-lg hover:shadow-xl flex items-center justify-center"
                                    >
                                        Confirmar ubicación e iniciar sesión
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full py-3 md:py-4 text-center mt-auto">
                <p className="text-xs md:text-sm font-light text-white/90 tracking-wide">
                    <span className="font-medium">FacilityManager</span>
                    <span className="font-light">Pro</span>
                    <span className="mx-1">©</span>
                    <span>2024</span>
                </p>
            </footer>
        </div>
    )
}

export default LoginPage


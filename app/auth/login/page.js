'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { toast } from 'react-hot-toast'
import { calculateDistance } from './DynamicMap'

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
        lat: 8.9741844,
        lng: -79.5673200,
        radius: 100
    }

    const simulateGPSPosition = useCallback(() => {
        if (!gpsSimulatorRef.current) {
            gpsSimulatorRef.current = {
                latitude: workArea.lat + (Math.random() - 0.5) * 0.001,
                longitude: workArea.lng + (Math.random() - 0.5) * 0.001
            }
        }
        return {
            coords: {
                latitude: gpsSimulatorRef.current.latitude,
                longitude: gpsSimulatorRef.current.longitude
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
        setLocationState(prev => ({ ...prev, error: '', isLoading: true }))

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
                localStorage.removeItem('adminPrincipal');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('adminId', '3');
                document.cookie = `userRole=admin; path=/; max-age=86400; secure; samesite=strict`;
                await router.push('/admin/dashboard');
                toast.success('Bienvenido Administrador');
            } else if (formState.username === 'enterprise' && formState.password === '123456') {
                localStorage.setItem('userRole', 'enterprise')
                document.cookie = `userRole=enterprise; path=/; max-age=86400; secure; samesite=strict`;
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
    }, [formState, router, simulateGPSPosition, workArea])

    const handleMapConfirmation = useCallback(() => {
        if (locationState.showConfirmation) {
            router.push('/user/usuario')
            toast.success('Ubicación confirmada correctamente')
        }
    }, [locationState.showConfirmation, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
                <div className="text-center mb-8">
                    <div className="mb-6 transform transition-transform duration-300 hover:scale-105">
                        <Image
                            src="/logo.jpg"
                            alt="Hombres de Blanco"
                            width={120}
                            height={120}
                            className="mx-auto rounded-xl shadow-md"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Bienvenido
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Usuario
                        </label>
                        <input
                            type="text"
                            value={formState.username}
                            onChange={(e) => setFormState(prev => ({ ...prev, username: e.target.value }))}
                            className="mt-1 block w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                                     focus:border-blue-500 focus:ring-blue-500 transition-all duration-200
                                     group-hover:border-blue-200 shadow-sm"
                            required
                        />
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={formState.showPassword ? 'text' : 'password'}
                                value={formState.password}
                                onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                                className="mt-1 block w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                                         focus:border-blue-500 focus:ring-blue-500 transition-all duration-200
                                         group-hover:border-blue-200 shadow-sm pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm font-medium text-blue-600 
                                         hover:text-blue-800 transition-colors duration-200"
                            >
                                {formState.showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>

                    {locationState.error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                            {locationState.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={locationState.isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent 
                                 rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r 
                                 from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]
                                 disabled:cursor-not-allowed"
                    >
                        {locationState.isLoading ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                Cargando...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200
                                        hover:underline">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                {locationState.showMap && (
                    <div className="mt-6 space-y-4">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <Map 
                                userLocation={locationState.userLocation} 
                                workArea={workArea}
                            />
                        </div>
                        <button
                            onClick={handleMapConfirmation}
                            className="w-full flex justify-center items-center py-3 px-4 rounded-xl 
                                     shadow-sm text-sm font-medium text-white bg-gradient-to-r 
                                     from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                                     transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            <span>Confirmar y Continuar</span>
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoginPage


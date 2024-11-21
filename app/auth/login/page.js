'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { toast } from 'react-hot-toast'
import { calculateDistance } from './DynamicMap'

const Map = dynamic(() => import('./DynamicMap'), { ssr: false, loading: () => <p>Cargando mapa...</p> })

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

    const workArea = useRef({
        lat: 8.993133054652601,
        lng: -79.50287017589892,
        radius: 100
    }).current

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
                    document.cookie = 'userRole=usuario; path=/';
                } else {
                    throw new Error('Debes estar dentro del área de trabajo para iniciar sesión')
                }
            } else if (formState.username === 'admin' && formState.password === '123456') {
                localStorage.setItem('userRole', 'admin')
                document.cookie = 'userRole=admin; path=/';
                router.push('/admin/dashboard')
                toast.success('Bienvenido Administrador')
            } else if (formState.username === 'enterprise' && formState.password === '123456') {
                localStorage.setItem('userRole', 'enterprise')
                document.cookie = 'userRole=enterprise; path=/';
                router.push('/enterprise/dashboard')
                toast.success('Bienvenido Enterprise')
            }
        } catch (error) {
            console.error(error)
            setLocationState(prev => ({ ...prev, error: error.message, isLoading: false }))
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
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                <div className="text-center mb-8">
                    <div className="mb-6">
                        <Image
                            src="/logo.jpg"
                            alt="Hombres de Blanco"
                            width={120}
                            height={120}
                            className="mx-auto"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Bienvenido</h2>
                    <p className="mt-1 text-sm text-gray-600">Ingresa tus credenciales para continuar</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Usuario
                        </label>
                        <input
                            type="text"
                            value={formState.username}
                            onChange={(e) => setFormState(prev => ({ ...prev, username: e.target.value }))}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={formState.showPassword ? 'text' : 'password'}
                                value={formState.password}
                                onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                                className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {formState.showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>
                    {locationState.error && (
                        <div className="text-red-600 text-sm">{locationState.error}</div>
                    )}
                    <button
                        type="submit"
                        disabled={locationState.isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {locationState.isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
                {locationState.showMap && (
                    <div className="mt-6">
                        <Map 
                            userLocation={locationState.userLocation} 
                            workArea={workArea}
                        />
                        <button
                            onClick={handleMapConfirmation}
                            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Confirmar y Continuar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoginPage


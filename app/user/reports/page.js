'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

export default function ReportsPage() {
    const router = useRouter()
    const [reportData, setReportData] = useState({
        area: '',
        tipoContingencia: '',
        descripcion: '',
        fotos: {
            antes: null,
            durante: null,
            despues: null
        },
        fotoUnica: null,
        modoFoto: 'multiple' // 'multiple' o 'unica'
    })

    const areas = [
        'Sala de Emergencias',
        'Quirófano',
        'UCI',
        'Pediatría',
        'Consulta Externa',
        'Laboratorio'
    ]

    const tiposContingencia = [
        'Derrame de líquidos',
        'Residuos biológicos',
        'Equipo dañado',
        'Falla en instalaciones',
        'Accidente',
        'Otro'
    ]

    const handlePhotoUpload = (stage, e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (reportData.modoFoto === 'multiple') {
                    setReportData(prev => ({
                        ...prev,
                        fotos: {
                            ...prev.fotos,
                            [stage]: reader.result
                        }
                    }))
                } else {
                    setReportData(prev => ({
                        ...prev,
                        fotoUnica: reader.result
                    }))
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!reportData.area || !reportData.tipoContingencia || !reportData.descripcion) {
            toast.error('Por favor complete todos los campos requeridos')
            return
        }

        if (reportData.modoFoto === 'multiple' && 
            (!reportData.fotos.antes || !reportData.fotos.durante || !reportData.fotos.despues)) {
            toast.error('Por favor suba todas las fotos requeridas')
            return
        }

        if (reportData.modoFoto === 'unica' && !reportData.fotoUnica) {
            toast.error('Por favor suba una foto del estado actual')
            return
        }

        // Aquí iría la lógica para enviar el reporte
        toast.success('Reporte enviado correctamente')
        setReportData({
            area: '',
            tipoContingencia: '',
            descripcion: '',
            fotos: { antes: null, durante: null, despues: null },
            fotoUnica: null,
            modoFoto: 'multiple'
        })
    }

    return (
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-4">
                    <h1 className="text-2xl font-bold text-white text-center">Reportes de Contingencia</h1>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Sección de información básica */}
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del Incidente</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                                        <select
                                            value={reportData.area}
                                            onChange={(e) => setReportData(prev => ({ ...prev, area: e.target.value }))}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Seleccione un área</option>
                                            {areas.map(area => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contingencia</label>
                                        <select
                                            value={reportData.tipoContingencia}
                                            onChange={(e) => setReportData(prev => ({ ...prev, tipoContingencia: e.target.value }))}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Seleccione el tipo</option>
                                            {tiposContingencia.map(tipo => (
                                                <option key={tipo} value={tipo}>{tipo}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción detallada</label>
                                        <textarea
                                            value={reportData.descripcion}
                                            onChange={(e) => setReportData(prev => ({ ...prev, descripcion: e.target.value }))}
                                            rows={4}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Describa la situación detalladamente..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sección de fotos */}
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Evidencia Fotográfica</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                checked={reportData.modoFoto === 'multiple'}
                                                onChange={() => setReportData(prev => ({ ...prev, modoFoto: 'multiple' }))}
                                                className="text-red-600 focus:ring-red-500"
                                            />
                                            <span className="ml-2">Fotos antes/durante/después</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                checked={reportData.modoFoto === 'unica'}
                                                onChange={() => setReportData(prev => ({ ...prev, modoFoto: 'unica' }))}
                                                className="text-red-600 focus:ring-red-500"
                                            />
                                            <span className="ml-2">Foto única del estado actual</span>
                                        </label>
                                    </div>

                                    {reportData.modoFoto === 'multiple' ? (
                                        <div className="grid grid-cols-3 gap-4">
                                            {['antes', 'durante', 'despues'].map((stage) => (
                                                <div key={stage} className="space-y-2">
                                                    <p className="text-sm font-medium text-gray-700 capitalize">
                                                        {stage === 'despues' ? 'después' : stage}
                                                    </p>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                                        {reportData.fotos[stage] ? (
                                                            <div className="relative h-48">
                                                                <Image
                                                                    src={reportData.fotos[stage]}
                                                                    alt={`Foto ${stage}`}
                                                                    fill
                                                                    className="object-cover rounded-lg"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <label className="cursor-pointer block text-center">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => handlePhotoUpload(stage, e)}
                                                                />
                                                                <div className="text-gray-500">
                                                                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                    <p className="mt-1">Subir foto</p>
                                                                </div>
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                            {reportData.fotoUnica ? (
                                                <div className="relative h-48">
                                                    <Image
                                                        src={reportData.fotoUnica}
                                                        alt="Estado actual"
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer block text-center">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handlePhotoUpload('unica', e)}
                                                    />
                                                    <div className="text-gray-500">
                                                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <p className="mt-1">Subir foto del estado actual</p>
                                                    </div>
                                                </label>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                Enviar Reporte
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

'use client';
import { useState, useEffect } from 'react';
import type { jsPDF } from 'jspdf';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Report {
  id: number;
  fecha: string;
  area: string;
  tipo: string;
  descripcion: string;
  estado: 'Pendiente' | 'Resuelto';
  archivos: {
    nombre: string;
    url: string;
    tipo: 'imagen' | 'documento';
  }[];
  esContingencia: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
  type: string;
}

export default function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState('dia');
  const [selectedArea, setSelectedArea] = useState('');
  const [contingencyType, setContingencyType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Agregar estado para paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [reportes, setReportes] = useState<Report[]>([
    {
      id: 1,
      fecha: '2024-03-15',
      area: 'Producción',
      tipo: 'Tubería rota',
      descripcion: 'Fuga en el baño principal',
      estado: 'Pendiente',
      archivos: [
        { nombre: 'foto1.jpg', url: '/ejemplo/foto1.jpg', tipo: 'imagen' },
        { nombre: 'reporte.pdf', url: '/ejemplo/reporte.pdf', tipo: 'documento' }
      ],
      esContingencia: true
    }
  ]);

  // Agregar array de tipos de contingencia
  const tiposContingencia = [
    'Tubería rota',
    'Falla eléctrica',
    'Incendio',
    'Inundación',
    'Fuga de gas',
    'Accidente laboral',
    'Falla de equipos',
    'Otro'
  ];

  // Agregar estos estados al inicio del componente
  const [stats, setStats] = useState({
    total: 1,
    pendientes: 1,
    resueltos: 0
  });

  // Cargar reportes al montar y cuando cambien los filtros
  useEffect(() => {
    fetchReports();
  }, [timeFilter, page]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const today = new Date();
      let startDate = new Date();
      
      switch(timeFilter) {
        case 'dia':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'semana':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'mes':
          startDate.setMonth(today.getMonth() - 1);
          break;
      }

      const response = await axios.get('/api/reports', {
        params: {
          startDate: startDate.toISOString(),
          endDate: today.toISOString(),
          page,
          limit: 10
        }
      });
      
      setReportes(response.data.reports || []);
      setTotalPages(response.data.totalPages || 1);
      
      const reportesActuales = response.data.reports || reportes;
      const total = reportesActuales.length;
      const pendientes = reportesActuales.filter(r => r.estado === 'Pendiente').length;
      setStats({
        total,
        pendientes,
        resueltos: total - pendientes
      });
    } catch {
      // Silenciar el error y mantener el estado actual
      setReportes([]);
      setTotalPages(1);
      setStats({
        total: 0,
        pendientes: 0,
        resueltos: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);

    // Crear URLs para preview
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Crear el nuevo reporte
      const newReport = {
        id: Date.now(), // Temporal, normalmente viene del backend
        fecha: new Date().toISOString().split('T')[0],
        area: selectedArea,
        tipo: contingencyType,
        descripcion: description,
        estado: 'Pendiente',
        esContingencia: true,
        archivos: selectedFiles.map(file => ({
          nombre: file.name,
          url: URL.createObjectURL(file),
          tipo: file.type.startsWith('image/') ? 'imagen' : 'documento'
        }))
      };

      // Simular llamada al API
      // const response = await axios.post('/api/reports', newReport);
      
      // Actualizar el estado local
      setReportes(prev => [newReport, ...prev]);
      
      // Actualizar estadísticas
      setStats(prev => ({
        total: prev.total + 1,
        pendientes: prev.pendientes + 1,
        resueltos: prev.resueltos
      }));

      // Limpiar el formulario
      setSelectedArea('');
      setContingencyType('');
      setDescription('');
      setSelectedFiles([]);
      setPreviewUrls([]);

      toast.success('Reporte creado exitosamente');
    } catch (error) {
      toast.error('Error al crear el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFiles = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handlePeriodChange = async (period: string) => {
    setTimeFilter(period);
    setPage(1); // Reset página al cambiar filtro
    await fetchReports();
  };

  // Agregar función para generar PDF
  const handleDownloadPDF = async (report: Report) => {
    try {
      // Aquí iría la lógica para generar y descargar el PDF
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      toast.error('Error al descargar el PDF');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: 'Pendiente' | 'Resuelto') => {
    try {
      // Simular llamada al API
      // await axios.patch(`/api/reports/${id}`, { estado: newStatus });

      // Actualizar el estado local
      setReportes(prev => prev.map(report => {
        if (report.id === id) {
          return { ...report, estado: newStatus };
        }
        return report;
      }));

      // Actualizar estadísticas correctamente
      setStats(prev => ({
        total: prev.total,
        pendientes: newStatus === 'Pendiente' 
          ? prev.pendientes + 1 
          : prev.pendientes - 1,
        resueltos: newStatus === 'Resuelto' 
          ? prev.resueltos + 1 
          : prev.resueltos - 1
      }));

      toast.success(`Estado actualizado a ${newStatus}`);
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  // Agregar la función handleDeleteReport
  const handleDeleteReport = async (e: React.MouseEvent, reportId: number) => {
    e.stopPropagation();
    
    if (!window.confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      return;
    }

    try {
      const reporteEliminado = reportes.find(r => r.id === reportId);
      
      // Actualizar el estado local
      setReportes(prev => prev.filter(report => report.id !== reportId));
      
      // Actualizar estadísticas correctamente
      if (reporteEliminado) {
        setStats(prev => ({
          total: Math.max(0, prev.total - 1),
          pendientes: reporteEliminado.estado === 'Pendiente' 
            ? Math.max(0, prev.pendientes - 1) 
            : prev.pendientes,
          resueltos: reporteEliminado.estado === 'Resuelto' 
            ? Math.max(0, prev.resueltos - 1) 
            : prev.resueltos
        }));
      }

      toast.success('Reporte eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el reporte');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header mejorado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Reportes de Contingencia
            </h1>
            <p className="mt-2 text-gray-600">Sistema de gestión y seguimiento de incidentes</p>
          </div>
          
          {/* Selector de período con diseño mejorado */}
          <div className="mt-4 md:mt-0">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-white border-2 border-blue-100 rounded-xl px-6 py-3 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 hover:border-blue-200 cursor-pointer
                        shadow-sm hover:shadow-md"
            >
              <option value="dia">Reportes de Hoy</option>
              <option value="semana">Reportes de la Semana</option>
              <option value="mes">Reportes del Mes</option>
            </select>
          </div>
        </div>

        {/* Tarjetas de estadísticas con animación y mejor diseño */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total de Reportes */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">Total Reportes</h2>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {stats.total}
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    {timeFilter === 'dia' ? 'Hoy' : 
                     timeFilter === 'semana' ? 'Esta Semana' : 
                     'Este Mes'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reportes Pendientes */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-xl hover:bg-yellow-200 transition-colors">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">Pendientes</h2>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                    {stats.pendientes}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1 font-medium">Requieren atención</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reportes Resueltos */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl hover:bg-green-200 transition-colors">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">Resueltos</h2>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    {stats.resueltos}
                  </p>
                  <p className="text-xs text-green-600 mt-1 font-medium">Completados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor principal con diseño mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tabla de Reportes */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Encabezado mejorado */}
            <div className="bg-white p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <svg 
                      className="w-6 h-6 text-blue-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 4v16m6-8H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">Crear Nuevo Reporte</h3>
                    <p className="text-gray-500 text-sm">Complete el formulario para registrar un nuevo reporte</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Fecha</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Área</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>¿Contingencia?</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Estado</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportes.map((reporte) => (
                    <tr 
                      key={reporte.id}
                      className="hover:bg-blue-50 transition-colors duration-150 ease-in-out cursor-pointer"
                      onClick={() => handleViewFiles(reporte)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{reporte.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reporte.area}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${reporte.esContingencia 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {reporte.esContingencia ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${reporte.estado === 'Pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'}`}
                        >
                          {reporte.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formulario con diseño mejorado */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Encabezado mejorado */}
            <div className="bg-white p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-600">Crear Nuevo Reporte</h3>
                  <p className="text-gray-500 text-sm">Complete el formulario para registrar un nuevo reporte</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Área */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Área</span>
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="block w-full rounded-xl border-2 border-gray-200 shadow-sm 
                             focus:border-red-500 focus:ring-red-500 transition-all duration-200
                             group-hover:border-red-200"
                    required
                  >
                    <option value="">Seleccione un área</option>
                    <option value="Bioseguridad">Bioseguridad</option>
                    <option value="Inyección">Inyección</option>
                    <option value="Cuarto Frío">Cuarto Frío</option>
                    <option value="Producción">Producción</option>
                    <option value="Techos, Paredes y Pisos">Techos, Paredes y Pisos</option>
                    <option value="Canaletas y Rejillas">Canaletas y Rejillas</option>
                    <option value="Área Externa">Área Externa</option>
                  </select>
                </div>

                {/* Tipo de Contingencia */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Tipo de Contingencia</span>
                  </label>
                  <select
                    value={contingencyType}
                    onChange={(e) => setContingencyType(e.target.value)}
                    className="block w-full rounded-xl border-2 border-gray-200 shadow-sm 
                             focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-200
                             group-hover:border-yellow-200"
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {tiposContingencia.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>Descripción</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="block w-full rounded-xl border-2 border-gray-200 shadow-sm 
                             focus:border-blue-500 focus:ring-blue-500 transition-all duration-200
                             group-hover:border-blue-200"
                    required
                  />
                </div>

                {/* Archivos */}
                <div className="group">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>Archivos Adjuntos</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full rounded-xl border-2 border-gray-200 shadow-sm 
                             focus:border-green-500 focus:ring-green-500 transition-all duration-200
                             group-hover:border-green-200"
                  />
                </div>
              </div>

              {/* Botón de envío mejorado */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl
                             hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2
                             focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200
                             transform hover:scale-105 shadow-md hover:shadow-lg
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center space-x-2`}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Reporte</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal con diseño mejorado */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 transform transition-all duration-300 scale-100">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Detalles del Reporte</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.fecha}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Área</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.area}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Contingencia</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.tipo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <span className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${selectedReport.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {selectedReport.estado}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Descripción</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-900 shadow-inner">
                  {selectedReport.descripcion}
                </div>
              </div>

              {selectedReport.archivos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Archivos Adjuntos</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedReport.archivos.map((archivo, index) => (
                      <div key={index} className="relative group">
                        {archivo.tipo === 'imagen' ? (
                          <img
                            src={archivo.url}
                            alt={archivo.nombre}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm truncate rounded-b-lg">
                          {archivo.nombre}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleDownloadPDF(selectedReport)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  
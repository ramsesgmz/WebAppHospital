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
      area: 'Área de Emergencias',
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header mejorado */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reportes de Contingencia</h1>
          
          {/* Selector de período */}
          <div className="flex items-center space-x-4">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dia">Hoy</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mes</option>
            </select>
          </div>
        </div>

        {/* Nuevas tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Total de Reportes */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Reportes</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {timeFilter === 'dia' ? 'Hoy' : 
                   timeFilter === 'semana' ? 'Esta Semana' : 
                   'Este Mes'}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Reportes Pendientes */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Pendientes</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.pendientes}</p>
                <p className="text-xs text-yellow-600 mt-1">Requieren atención</p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Reportes Resueltos */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Resueltos</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.resueltos}</p>
                <p className="text-xs text-green-600 mt-1">Completados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor principal para tabla y formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tabla de Reportes (lado izquierdo) */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-semibold text-gray-900">Reportes Realizados</h2>
              <p className="mt-1 text-sm text-gray-500">Historial de contingencias reportadas</p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="w-[35%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Área
                      </th>
                      <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ¿Contingencia?
                      </th>
                      <th className="w-[25%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportes.map((reporte, idx) => (
                      <tr 
                        key={reporte.id} 
                        onClick={() => handleViewFiles(reporte)}
                        className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                                   hover:bg-blue-50 cursor-pointer transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {reporte.fecha}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 overflow-hidden text-ellipsis">
                            {reporte.area}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${reporte.esContingencia ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {reporte.esContingencia ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(reporte.id, reporte.estado === 'Pendiente' ? 'Resuelto' : 'Pendiente');
                              }}
                              className={`px-3 py-1 text-xs rounded-full ${
                                reporte.estado === 'Pendiente'
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {reporte.estado}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewFiles(reporte);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Ver
                            </button>
                            <button
                              onClick={(e) => handleDeleteReport(e, reporte.id)}
                              className="text-red-600 hover:text-red-800 text-sm flex items-center"
                              title="Eliminar reporte"
                            >
                              <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="2" 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginación */}
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={page === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Formulario de Creación (lado derecho) */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Reporte</h2>
              <p className="mt-1 text-sm text-gray-500">Complete el formulario para registrar un nuevo reporte</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Área */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Área
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione un área</option>
                    <option value="Área de Limpieza General">Área de Limpieza General</option>
                    <option value="Área de Almacén">Área de Almacén</option>
                    <option value="Área de Mantenimiento">Área de Mantenimiento</option>
                    <option value="Área de Inyección">Área de Inyección</option>
                    <option value="Área de Control de Calidad">Área de Control de Calidad</option>
                  </select>
                </div>

                {/* Tipo de Contingencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Contingencia
                  </label>
                  <select
                    value={contingencyType}
                    onChange={(e) => setContingencyType(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {tiposContingencia.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Archivos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Archivos Adjuntos
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                  />
                </div>

                {/* Preview de archivos */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md
                             hover:bg-blue-700 focus:outline-none focus:ring-2
                             focus:ring-blue-500 focus:ring-offset-2 
                             transition-colors flex items-center shadow-md
                             ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Reporte'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal mejorado */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
  
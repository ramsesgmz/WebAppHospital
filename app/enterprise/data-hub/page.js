'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { COMPANY_LOGO } from '../../config/brandConfig';

// Datos de ejemplo de empresas
const empresasData = [
  {
    id: 1,
    nombre: "Marpesca S.A.",
    logo: "/marpesca-logo.jpg",
    resumen: {
      personal: "98 empleados",
      area: "7 áreas",
      actividad: "45 operaciones"
    },
    ultima_actualizacion: "2024-02-20",
    estado: 'Activo'
  },
  {
    id: 2,
    nombre: "Empresa 2",
    logo: "/logo2.jpg",
    resumen: {
      personal: "87 empleados",
      area: "6 áreas",
      actividad: "34 operaciones"
    },
    ultima_actualizacion: "2024-02-19",
    estado: 'Activo'
  },
  {
    id: 3,
    nombre: "Empresa 3",
    logo: "/logo3.jpg",
    resumen: {
      personal: "15 empleados",
      area: "4 áreas",
      actividad: "67 operaciones"
    },
    ultima_actualizacion: "2024-02-18",
    estado: 'Activo'
  },
  {
    id: 4,
    nombre: "Empresa 4",
    logo: "/logo4.jpg",
    resumen: {
      personal: "23 empleados",
      area: "9 áreas",
      actividad: "89 operaciones"
    },
    ultima_actualizacion: "2024-02-21",
    estado: 'Activo'
  },
  {
    id: 5,
    nombre: "Empresa 5",
    logo: "/logo5.jpg",
    resumen: {
      personal: "9 empleados",
      area: "8 áreas",
      actividad: "23 operaciones"
    },
    ultima_actualizacion: "2024-02-20",
    estado: 'Activo'
  },
  {
    id: 6,
    nombre: "Empresa 6",
    logo: "/logo6.jpg",
    resumen: {
      personal: "34 empleados",
      area: "8 áreas",
      actividad: "78 operaciones"
    },
    ultima_actualizacion: "2024-02-19",
    estado: 'Activo'
  },
  {
    id: 7,
    nombre: "Empresa 7",
    logo: "/logo7.jpg",
    resumen: {
      personal: "45 empleados",
      area: "9 áreas",
      actividad: "92 operaciones"
    },
    ultima_actualizacion: "2024-02-18",
    estado: 'Activo'
  }
];

export default function DataHubPage() {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [sortBy, setSortBy] = useState('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [empresaEliminando, setEmpresaEliminando] = useState(null);

  // Primero definimos la función de filtrado
  const getFilteredItems = () => {
    const filteredItems = empresasData.filter(empresa => {
      // Filtrar por término de búsqueda
      const matchesSearch = empresa.nombre.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filtrar por estado
      const matchesStatus = filterStatus === 'todas' ? true :
        filterStatus === 'activas' ? empresa.estado === 'Activo' :
        empresa.estado === 'Inactivo';

      return matchesSearch && matchesStatus;
    });

    // Ordenar los items, pero asegurando que Marpesca siempre esté primero
    return filteredItems.sort((a, b) => {
      // Si es Marpesca, siempre va primero
      if (a.nombre === "Marpesca S.A.") return -1;
      if (b.nombre === "Marpesca S.A.") return 1;

      // Para el resto de empresas, mantener el ordenamiento normal
      switch (sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'fecha':
          return new Date(b.ultima_actualizacion) - new Date(a.ultima_actualizacion);
        case 'personal':
          return b.resumen.personal - a.resumen.personal;
        default:
          return 0;
      }
    });
  };

  // Luego usamos la función para calcular el total de páginas
  const totalPages = Math.ceil(getFilteredItems().length / itemsPerPage);

  const getCurrentPageItems = () => {
    const filteredItems = getFilteredItems();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  };

  // Función para cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para ir a la página anterior
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Función para ir a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Generar array de números de página
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Estadísticas totales calculadas
  const stats = {
    totalEmpresas: "1,234",
    totalDato1: "45.6K",
    totalDato2: "89%",
    totalDato3: "$234.5K"
  };

  const handleExport = (format) => {
    // Aquí irá la lógica de exportación
    console.log(`Exportando en formato ${format}`);
    setShowExportMenu(false);
  };

  const handleImport = (format) => {
    // Aquí irá la lógica de importación
    console.log(`Importando en formato ${format}`);
    setShowImportMenu(false);
  };

  // Efecto para resetear la página actual cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  const handleEdit = (empresa) => {
    setEmpresaEditando(empresa);
  };

  const handleDelete = (empresa) => {
    setEmpresaEliminando(empresa);
  };

  const confirmarEliminacion = () => {
    // Aquí iría la lógica de eliminación
    console.log(`Eliminando empresa ${empresaEliminando.nombre}`);
    setEmpresaEliminando(null);
  };

  const PaginationButton = ({ children, onClick, active, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded ${
        active 
          ? 'bg-blue-600 text-white' 
          : disabled
            ? 'border text-gray-400 cursor-not-allowed'
            : 'border text-gray-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    // Siempre mostrar primera página
    buttons.push(
      <PaginationButton
        key="first"
        onClick={() => handlePageChange(1)}
        active={currentPage === 1}
      >
        1
      </PaginationButton>
    );

    // Calcular rango de botones a mostrar
    let start = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2));
    let end = Math.min(totalPages - 1, start + maxVisibleButtons - 1);

    // Ajustar si estamos cerca del final
    if (end === totalPages - 1) {
      start = Math.max(2, end - maxVisibleButtons + 1);
    }

    // Agregar elipsis si es necesario
    if (start > 2) {
      buttons.push(<span key="ellipsis1" className="px-2">...</span>);
    }

    // Agregar páginas intermedias
    for (let i = start; i <= end; i++) {
      buttons.push(
        <PaginationButton
          key={i}
          onClick={() => handlePageChange(i)}
          active={currentPage === i}
        >
          {i}
        </PaginationButton>
      );
    }

    // Agregar elipsis final si es necesario
    if (end < totalPages - 1) {
      buttons.push(<span key="ellipsis2" className="px-2">...</span>);
    }

    // Siempre mostrar última página si hay más de una página
    if (totalPages > 1) {
      buttons.push(
        <PaginationButton
          key="last"
          onClick={() => handlePageChange(totalPages)}
          active={currentPage === totalPages}
        >
          {totalPages}
        </PaginationButton>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado Mejorado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-white">Centro de Datos</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between mb-6">
          {/* Botón Exportar con menú - Ahora a la izquierda */}
          <div className="relative">
            <button
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowImportMenu(false);
              }}
              className="bg-blue-50 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow
                       text-blue-600 font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Exportar</span>
            </button>

            {/* Menú de exportación */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>CSV (.csv)</span>
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>JSON (.json)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botón Importar con menú - Ahora a la derecha */}
          <div className="relative">
            <button
              onClick={() => {
                setShowImportMenu(!showImportMenu);
                setShowExportMenu(false);
              }}
              className="bg-green-50 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow
                       text-green-600 font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Importar</span>
            </button>

            {/* Menú de importación */}
            {showImportMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => handleImport('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Desde Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => handleImport('csv')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Desde CSV (.csv)</span>
                  </button>
                  <button
                    onClick={() => handleImport('json')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>Desde JSON (.json)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm text-gray-500">Total Empresas</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalEmpresas}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm text-gray-500">Total Dato 1</h3>
            <p className="text-2xl font-bold text-green-600">{stats.totalDato1}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm text-gray-500">Promedio Dato 2</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.totalDato2}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-sm text-gray-500">Total Dato 3</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.totalDato3}</p>
          </div>
        </div>

        {/* Barra de búsqueda y filtros - NUEVO */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select 
              className="px-4 py-2 rounded-lg border border-gray-200"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="todas">Todas las empresas</option>
              <option value="activas">Activas</option>
              <option value="inactivas">Inactivas</option>
            </select>
            <select 
              className="px-4 py-2 rounded-lg border border-gray-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nombre">Ordenar por nombre</option>
              <option value="fecha">Fecha de actualización</option>
              <option value="personal">Total personal</option>
            </select>
          </div>
        </div>

        {/* Grid de empresas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentPageItems().map((empresa) => (
            <div key={empresa.id} 
                 className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden 
                          hover:shadow-xl transition-all duration-300 border border-blue-100 group relative">
              {/* Acciones Rápidas - NUEVO */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(empresa)}
                    className="p-2 bg-white rounded-full shadow text-gray-400 hover:text-blue-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(empresa)}
                    className="p-2 bg-white rounded-full shadow text-gray-400 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Encabezado de la empresa */}
              <div className="p-4 border-b border-blue-100 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden
                                shadow-sm group-hover:shadow-md transition-shadow">
                    {empresa.nombre === "Marpesca S.A." ? (
                      <Image
                        src={COMPANY_LOGO}
                        alt="Marpesca Logo"
                        width={48}
                        height={48}
                        className="object-contain"
                        priority
                      />
                    ) : (
                      <span className="text-xl font-bold text-blue-600">
                        {empresa.nombre.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                      {empresa.nombre}
                    </h3>
                    <span className="text-sm text-blue-400">
                      Empresa Registrada
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido/Resumen */}
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <span className="text-gray-700">Personal</span>
                    <span className="font-medium text-blue-600">{empresa.resumen.personal}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                    <span className="text-gray-700">Áreas</span>
                    <span className="font-medium text-green-600">{empresa.resumen.area}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    <span className="text-gray-700">Actividad</span>
                    <span className="font-medium text-purple-600">{empresa.resumen.actividad}</span>
                  </div>

                  <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded-lg">
                    Última actualización: Pendiente
                  </div>
                </div>
              </div>

              {/* Botón de más información */}
              <div className="p-4 bg-white border-t border-gray-100">
                <button
                  onClick={() => setEmpresaSeleccionada(empresa.id)}
                  className="w-full bg-white py-2 px-4 rounded-lg border border-blue-300
                           hover:bg-blue-50 transition-colors duration-200 font-medium
                           flex items-center justify-center space-x-2 text-blue-600"
                >
                  <span>Más Información</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación simplificada */}
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </PaginationButton>
            
            {renderPaginationButtons()}
            
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </PaginationButton>
          </nav>
        </div>
      </div>

      {/* Modal simplificado */}
      {empresaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Información Detallada
                </h2>
                <button 
                  onClick={() => setEmpresaSeleccionada(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500">
                Contenido pendiente
              </div>
            </div>
          </div>
        </div>
      )}

      {empresaEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Editar Empresa
                </h2>
                <button 
                  onClick={() => setEmpresaEditando(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Personal
                  </label>
                  <input
                    type="text"
                    defaultValue={empresaEditando.resumen.personal}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Áreas
                  </label>
                  <input
                    type="text"
                    defaultValue={empresaEditando.resumen.area}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Actividad
                  </label>
                  <input
                    type="text"
                    defaultValue={empresaEditando.resumen.actividad}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEmpresaEditando(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {empresaEliminando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Confirmar Eliminación</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                ¿Estás seguro de que deseas eliminar la empresa "{empresaEliminando.nombre}"? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEmpresaEliminando(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminacion}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
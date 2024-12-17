'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { COMPANY_LOGO } from '../../config/brandConfig';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Icon } from '../../shared/components/icons';

// Actualizar los datos de ejemplo
const empresasData = [
  {
    id: 1,
    nombre: "Hombres de Blanco",
    logo: "/logo.jpg",
    resumen: {
      personal: "156 empleados",
      area: "12 áreas",
      actividad: "1,234 servicios"
    },
    ultima_actualizacion: "2024-03-10",
    estado: 'Activo',
    estadisticas: {
      pacientes_atendidos: "8,546",
      satisfaccion_cliente: "98%",
      servicios_emergencia: "456",
      tiempo_respuesta: "15 min"
    },
    servicios_principales: [
      "Atención médica domiciliaria",
      "Servicios de emergencia",
      "Cuidados post-operatorios",
      "Terapia física"
    ]
  },
  {
    id: 2,
    nombre: "Servicio de Seguridad",
    logo: "/security-logo.jpg",
    resumen: {
      personal: "234 empleados",
      area: "8 áreas",
      actividad: "892 operativos"
    },
    ultima_actualizacion: "2024-03-09",
    estado: 'Activo',
    estadisticas: {
      zonas_vigiladas: "145",
      incidentes_prevenidos: "234",
      patrullas_activas: "45",
      tiempo_respuesta: "8 min"
    },
    servicios_principales: [
      "Vigilancia 24/7",
      "Monitoreo CCTV",
      "Control de accesos",
      "Respuesta a emergencias"
    ]
  },
  {
    id: 3,
    nombre: "Servicio de Transporte",
    logo: "/transport-logo.jpg",
    resumen: {
      personal: "178 empleados",
      area: "6 áreas",
      actividad: "678 servicios"
    },
    ultima_actualizacion: "2024-03-08",
    estado: 'Activo',
    estadisticas: {
      flota_activa: "89 unidades",
      viajes_completados: "12,456",
      puntualidad: "97%",
      satisfaccion_cliente: "96%"
    },
    servicios_principales: [
      "Transporte ejecutivo",
      "Logística empresarial",
      "Servicios especiales",
      "Traslados programados"
    ]
  }
];

const exportFormats = {
  EXCEL: {
    id: 'excel',
    name: 'Excel (.xlsx)',
    icon: 'excel-icon',
    extensions: ['.xlsx', '.xls']
  },
  CSV: {
    id: 'csv',
    name: 'CSV (.csv)',
    icon: 'csv-icon',
    extensions: ['.csv']
  },
  JSON: {
    id: 'json',
    name: 'JSON (.json)',
    icon: 'json-icon',
    extensions: ['.json']
  },
  PDF: {
    id: 'pdf',
    name: 'PDF Report (.pdf)',
    icon: 'pdf-icon',
    extensions: ['.pdf']
  },
  XML: {
    id: 'xml',
    name: 'XML (.xml)',
    icon: 'xml-icon',
    extensions: ['.xml']
  },
  ODT: {
    id: 'odt',
    name: 'OpenDocument (.odt)',
    icon: 'odt-icon',
    extensions: ['.odt']
  },
  DOCX: {
    id: 'docx',
    name: 'Word Document (.docx)',
    icon: 'word-icon',
    extensions: ['.docx']
  },
  ODS: {
    id: 'ods',
    name: 'OpenDocument Spreadsheet (.ods)',
    icon: 'ods-icon',
    extensions: ['.ods']
  }
};

// Actualizaciones en el componente de estadísticas
const StatsCard = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                   border-l-4 ${color} transform hover:-translate-y-1`}>
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className={`text-2xl font-bold ${color.replace('border-', 'text-')}`}>{value}</p>
      </div>
    </div>
  </div>
);

// Actualización en el grid de empresas
const CompanyCard = ({ empresa, onSelect }) => (
  <div 
    onClick={() => onSelect(empresa)}
    className="group relative bg-white rounded-xl shadow-lg overflow-hidden 
               transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
               cursor-pointer"
  >
    {/* Header con sombras sutiles */}
    <div className="h-24 bg-white relative overflow-hidden border-b">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-md 
                         transform transition-all duration-300 group-hover:shadow-lg">
            {empresa.nombre === "Hombres de Blanco" ? (
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 
                            flex items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-gray-700">
                  {empresa.nombre.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 
                          transition-colors duration-300">
              {empresa.nombre}
            </h3>
            <p className="text-sm text-gray-500">ID: {empresa.id}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Contenido con animaciones */}
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg 
                      transform transition-all duration-300 hover:scale-105">
          <div className="p-2 bg-blue-100 rounded-full">
            <Icon type="user" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Personal</p>
            <p className="font-semibold text-blue-600">{empresa.resumen.personal}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg 
                      transform transition-all duration-300 hover:scale-105">
          <div className="p-2 bg-green-100 rounded-full">
            <Icon type="chart" className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Áreas</p>
            <p className="font-semibold text-green-600">{empresa.resumen.area}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg 
                      transform transition-all duration-300 hover:scale-105">
          <div className="p-2 bg-purple-100 rounded-full">
            <Icon type="chart" className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Actividad</p>
            <p className="font-semibold text-purple-600">{empresa.resumen.actividad}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Barra de búsqueda mejorada
const SearchBar = ({ searchTerm, onSearch, filterStatus, onFilterChange, sortBy, onSortChange }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon type="search" className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar empresa..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 
                   focus:ring-2 focus:ring-blue-200 transition-all duration-300"
        />
      </div>
      
      <div className="flex gap-4">
        <select 
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                   transition-all duration-300"
        >
          <option value="todas">Todas las empresas</option>
          <option value="activas">Activas</option>
          <option value="inactivas">Inactivas</option>
        </select>

        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                   transition-all duration-300"
        >
          <option value="nombre">Ordenar por nombre</option>
          <option value="fecha">Fecha de actualización</option>
          <option value="personal">Total personal</option>
        </select>
      </div>
    </div>
  </div>
);

// Añade este componente para el modal de confirmación de eliminación
const DeleteConfirmationModal = ({ empresa, onClose, onConfirm }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <Icon type="delete" className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Confirmar Eliminación
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          ¿Estás seguro de que deseas eliminar la empresa "{empresa.nombre}"? Esta acción no se puede deshacer.
        </p>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
                   hover:bg-gray-200 transition-colors duration-300"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg
                   hover:bg-red-700 transition-colors duration-300"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

// Actualiza el DetailModal para manejar las acciones correctamente
const DetailModal = ({ empresa, onClose, onEdit, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden relative">
          {/* Botón de cierre (X) */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100
                     transition-colors duration-200 group z-10"
            aria-label="Cerrar"
          >
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>

          {/* Header del modal */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              {/* Logo o inicial */}
              <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-md mr-4">
                {empresa.nombre === "Hombres de Blanco" ? (
                  <Image
                    src="/logo.jpg"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 
                                flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-700">
                      {empresa.nombre.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {/* Título y subtítulo */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {empresa.nombre}
                </h2>
                <p className="text-sm text-gray-500">
                  Última actualización: {empresa.ultima_actualizacion}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido del modal */}
          <div className="p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Estado de la empresa */}
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                              ${empresa.estado === 'Activo' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'}`}>
                  <span className={`w-2 h-2 rounded-full mr-2
                                ${empresa.estado === 'Activo' 
                                  ? 'bg-green-400' 
                                  : 'bg-gray-400'}`}></span>
                  {empresa.estado}
                </span>
              </div>

              {/* Estadísticas principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(empresa.estadisticas).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{value}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Información detallada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Información General</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm text-gray-600">Personal: {empresa.resumen.personal}</p>
                    <p className="text-sm text-gray-600">Áreas: {empresa.resumen.area}</p>
                    <p className="text-sm text-gray-600">Actividad: {empresa.resumen.actividad}</p>
                    <p className="text-sm text-gray-600">Última actualización: {empresa.ultima_actualizacion}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Servicios Principales</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {empresa.servicios_principales.map((servicio, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          {servicio}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones de acción */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  onClose();
                  onEdit(empresa);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 transition-colors duration-300
                         flex items-center space-x-2"
              >
                <Icon type="edit" className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg
                         hover:bg-red-700 transition-colors duration-300
                         flex items-center space-x-2"
              >
                <Icon type="delete" className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          empresa={empresa}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={() => {
            onDelete(empresa);
            setShowDeleteConfirmation(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

// Añade este componente para el menú de exportación
const ExportMenu = ({ onClose, onExport }) => (
  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg z-50 
                  transform transition-all duration-200 border border-gray-100">
    <div className="p-2 space-y-1">
      <h3 className="text-xs font-semibold text-gray-500 px-3 py-1">Documentos</h3>
      <button
        onClick={() => onExport('pdf')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Icon type="document" className="w-4 h-4 text-red-500" />
        <span>PDF (.pdf)</span>
      </button>
      <button
        onClick={() => onExport('docx')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Icon type="document" className="w-4 h-4 text-blue-500" />
        <span>Word (.docx)</span>
      </button>
    </div>

    <div className="border-t border-gray-100 p-2 space-y-1">
      <h3 className="text-xs font-semibold text-gray-500 px-3 py-1">Datos</h3>
      <button
        onClick={() => onExport('excel')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Icon type="spreadsheet" className="w-4 h-4 text-green-500" />
        <span>Excel (.xlsx)</span>
      </button>
      <button
        onClick={() => onExport('csv')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Icon type="document" className="w-4 h-4 text-gray-500" />
        <span>CSV (.csv)</span>
      </button>
      <button
        onClick={() => onExport('json')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Icon type="code" className="w-4 h-4 text-yellow-500" />
        <span>JSON (.json)</span>
      </button>
    </div>
  </div>
);

// Añade este componente para el menú de importación
const ImportMenu = ({ onClose, onImport }) => (
  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg z-50 
                  transform transition-all duration-200 border border-gray-100">
    <div className="p-2 space-y-1">
      <h3 className="text-xs font-semibold text-gray-500 px-3 py-1">Importar desde</h3>
      <button
        onClick={() => onImport('excel')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Icon type="spreadsheet" className="w-4 h-4 text-green-500" />
        <span>Excel (.xlsx, .xls)</span>
      </button>
      <button
        onClick={() => onImport('csv')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Icon type="document" className="w-4 h-4 text-gray-500" />
        <span>CSV (.csv)</span>
      </button>
      <button
        onClick={() => onImport('json')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Icon type="code" className="w-4 h-4 text-yellow-500" />
        <span>JSON (.json)</span>
      </button>
    </div>
  </div>
);

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

  // Actualizar las estadísticas generales con ingresos más realistas
  const stats = {
    totalEmpresas: "3",
    totalPersonal: "568",
    promedioActividad: "2,804",
    ingresosMensuales: "$573.3K" // Actualizado a $573.3K
  };

  // Función para exportar datos
  const handleExport = async (format) => {
    try {
      // Obtener los datos a exportar
      const dataToExport = getFilteredItems();
      
      switch (format) {
        case 'excel':
          // Preparar los datos para Excel
          const ws = XLSX.utils.json_to_sheet(dataToExport.map(item => ({
            Empresa: item.nombre,
            Personal: item.resumen.personal,
            Areas: item.resumen.area,
            Actividad: item.resumen.actividad,
            Estado: item.estado,
            Ultima_Actualizacion: item.ultima_actualizacion
          })));
          
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Empresas");
          
          // Generar el archivo
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(excelData, 'empresas.xlsx');
          break;

        case 'csv':
          // Convertir datos a CSV
          const csv = Papa.unparse(dataToExport.map(item => ({
            Empresa: item.nombre,
            Personal: item.resumen.personal,
            Areas: item.resumen.area,
            Actividad: item.resumen.actividad,
            Estado: item.estado,
            Ultima_Actualizacion: item.ultima_actualizacion
          })));
          
          const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          saveAs(csvData, 'empresas.csv');
          break;

        case 'json':
          const jsonData = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
          saveAs(jsonData, 'empresas.json');
          break;

        default:
          throw new Error('Formato no soportado');
      }

      toast.success(`Datos exportados exitosamente en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar los datos');
    } finally {
      setShowExportMenu(false);
    }
  };

  // Función para importar datos
  const handleImport = async (format) => {
    try {
      // Crear un input de tipo file oculto
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = format === 'excel' ? '.xlsx, .xls' : 
                        format === 'csv' ? '.csv' : '.json';
      
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          switch (format) {
            case 'excel':
              const excelData = await file.arrayBuffer();
              const wb = XLSX.read(excelData);
              const ws = wb.Sheets[wb.SheetNames[0]];
              const jsonData = XLSX.utils.sheet_to_json(ws);
              await processImportedData(jsonData);
              break;

            case 'csv':
              Papa.parse(file, {
                complete: async (results) => {
                  await processImportedData(results.data);
                },
                header: true,
                skipEmptyLines: true
              });
              break;

            case 'json':
              const reader = new FileReader();
              reader.onload = async (e) => {
                const jsonData = JSON.parse(e.target.result);
                await processImportedData(jsonData);
              };
              reader.readAsText(file);
              break;
          }
        } catch (error) {
          console.error('Error al procesar el archivo:', error);
          toast.error('Error al procesar el archivo');
        }
      };

      fileInput.click();
    } catch (error) {
      console.error('Error al importar:', error);
      toast.error('Error al importar los datos');
    } finally {
      setShowImportMenu(false);
    }
  };

  // Función auxiliar para procesar los datos importados
  const processImportedData = async (data) => {
    try {
      // Aquí iría la lógica para validar y procesar los datos importados
      // Por ejemplo, enviarlos a tu API
      console.log('Datos importados:', data);
      
      // Ejemplo de validación básica
      if (!Array.isArray(data)) {
        throw new Error('El formato de los datos no es válido');
      }

      // Aquí irían las llamadas a tu API para guardar los datos
      // await api.post('/empresas/bulk', data);

      toast.success('Datos importados exitosamente');
    } catch (error) {
      console.error('Error al procesar los datos:', error);
      toast.error('Error al procesar los datos importados');
    }
  };

  // Efecto para resetear la página actual cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  const handleEdit = (empresa) => {
    setEmpresaSeleccionada(null); // Cerrar el modal de detalle
    setEmpresaEditando(empresa); // Abrir el modal de edición
  };

  const handleDelete = (empresa) => {
    // Aquí iría la lógica de eliminación
    console.log(`Eliminando empresa ${empresa.nombre}`);
    // Ejemplo de cómo podrías eliminar la empresa
    // await deleteEmpresa(empresa.id);
    // Actualizar el estado local
    // setEmpresas(empresas.filter(e => e.id !== empresa.id));
    toast.success(`Empresa ${empresa.nombre} eliminada correctamente`);
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

  // Añade este efecto en el componente principal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu || showImportMenu) {
        const isClickInsideExport = event.target.closest('[data-export-menu]');
        const isClickInsideImport = event.target.closest('[data-import-menu]');
        
        if (!isClickInsideExport && !isClickInsideImport) {
          setShowExportMenu(false);
          setShowImportMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu, showImportMenu]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header con animación */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Data Hub Empresarial
          </h1>
          <p className="text-gray-600">
            Gestiona y analiza la información de todas tus empresas en un solo lugar
          </p>
        </div>

        {/* Botones de acción principales */}
        <div className="flex justify-between mb-8">
          {/* Botón y menú de Exportar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowImportMenu(false);
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white
                       px-6 py-3 rounded-lg shadow-lg hover:shadow-xl
                       transform hover:-translate-y-1 transition-all duration-300
                       flex items-center space-x-2"
            >
              <Icon type="export" className="w-5 h-5" />
              <span>Exportar</span>
            </button>
            
            {showExportMenu && (
              <ExportMenu
                onClose={() => setShowExportMenu(false)}
                onExport={(format) => {
                  handleExport(format);
                  setShowExportMenu(false);
                }}
              />
            )}
          </div>

          {/* Botón y menú de Importar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowImportMenu(!showImportMenu);
                setShowExportMenu(false);
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white
                       px-6 py-3 rounded-lg shadow-lg hover:shadow-xl
                       transform hover:-translate-y-1 transition-all duration-300
                       flex items-center space-x-2"
            >
              <Icon type="import" className="w-5 h-5" />
              <span>Importar</span>
            </button>

            {showImportMenu && (
              <ImportMenu
                onClose={() => setShowImportMenu(false)}
                onImport={(format) => {
                  handleImport(format);
                  setShowImportMenu(false);
                }}
              />
            )}
          </div>
        </div>

        {/* Estadísticas con animaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Empresas"
            value={stats.totalEmpresas}
            icon={<Icon type="company" className="w-6 h-6" />}
            color="border-blue-600"
          />
          <StatsCard
            title="Total Personal"
            value={stats.totalPersonal}
            icon={<Icon type="user" className="w-6 h-6" />}
            color="border-green-600"
          />
          <StatsCard
            title="Promedio Actividad"
            value={stats.promedioActividad}
            icon={<Icon type="chart" className="w-6 h-6" />}
            color="border-purple-600"
          />
          <StatsCard
            title="Total Ingresos"
            value={stats.ingresosMensuales}
            icon={<Icon type="money" className="w-6 h-6" />}
            color="border-yellow-600"
          />
        </div>

        {/* Barra de búsqueda mejorada */}
        <SearchBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Grid de empresas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentPageItems().map((empresa) => (
            <CompanyCard
              key={empresa.id}
              empresa={empresa}
              onSelect={setEmpresaSeleccionada}
            />
          ))}
        </div>

        {/* Paginación mejorada */}
        <div className="mt-8">
          <nav className="flex justify-center">
            <ul className="flex space-x-2">
              <li>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-50 transition-colors duration-300"
                >
                  Anterior
                </button>
              </li>
              {renderPaginationButtons()}
              <li>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-50 transition-colors duration-300"
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Modal de detalle */}
      {empresaSeleccionada && (
        <DetailModal
          empresa={empresaSeleccionada}
          onClose={() => setEmpresaSeleccionada(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal de edición */}
      {empresaEditando && (
        <EditModal
          empresa={empresaEditando}
          onClose={() => setEmpresaEditando(null)}
          onSave={(updatedEmpresa) => {
            // Aquí iría la lógica para guardar los cambios
            console.log('Guardando cambios:', updatedEmpresa);
            setEmpresaEditando(null);
          }}
        />
      )}
    </div>
  );
} 
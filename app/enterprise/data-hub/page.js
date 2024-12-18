'use client';
import { useState, useEffect, useRef } from 'react';
import { dataHubService } from '@/services/dataHubService';

export default function DataHubPage() {
  const [data, setData] = useState({
    summary: {
      totalEmpresas: 0,
      totalPersonal: 0,
      promedioActividad: 0,
      totalIngresos: "$0"
    },
    organizations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas las empresas');
  const [sortBy, setSortBy] = useState('Ordenar por nombre');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const fileInputRef = useRef(null);
  const [importType, setImportType] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await dataHubService.getDataHubSummary();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleExport = async (format) => {
    try {
      setLoading(true);
      await dataHubService.exportEnterpriseData(format);
      alert('Datos exportados correctamente');
    } catch (err) {
      console.error('Error al exportar:', err);
      setError(err.message);
      alert('Error al exportar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      const result = await dataHubService.importExternalData();
      console.log('Datos importados:', result);
      
      // Recargar los datos después de importar
      await loadData();
      
      // Mostrar mensaje de éxito
      alert('Datos importados correctamente');
      setShowImportMenu(false);
    } catch (err) {
      console.error('Error al importar:', err);
      setError(err.message);
      alert('Error al importar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setLoading(true);
      const fileExtension = file.name.split('.').pop().toLowerCase();

      let result;
      switch (fileExtension) {
        case 'xlsx':
        case 'xls':
          result = await dataHubService.importFromExcel(file);
          break;
        case 'csv':
          result = await dataHubService.importFromCSV(file);
          break;
        case 'json':
          result = await dataHubService.importFromJSON(file);
          break;
        default:
          throw new Error('Formato de archivo no soportado');
      }

      await loadData(); // Recargar datos
      alert('Archivo importado correctamente');
      setShowImportMenu(false);
    } catch (err) {
      console.error('Error al importar archivo:', err);
      setError(err.message);
      alert('Error al importar: ' + err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Limpiar input
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Hub Empresarial</h1>
        <p className="text-gray-600">Gestiona y analiza la información de todas tus empresas en un solo lugar</p>
      </div>

      <div className="flex justify-between mb-8">
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-2">↓</span> Exportar
          </button>
          
          {showExportMenu && (
            <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={() => handleExport('json')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Exportar como JSON
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Exportar como Excel
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Exportar como CSV
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowImportMenu(!showImportMenu)}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-2">↑</span> Importar
          </button>
          
          {showImportMenu && (
            <div className="absolute right-0 z-10 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={handleImport}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Importar datos de APIs externas
                </button>
                
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-500 mb-2">Importar desde archivo:</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.json"
                    onChange={handleFileImport}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500">
                    Formatos soportados: Excel, CSV, JSON
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">🏢</div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Empresas</p>
              <p className="text-xl font-bold">{data.summary.totalEmpresas}</p>
            </div>
          </div>
        </div>
        {/* ... Otras tarjetas de resumen similares ... */}
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar empresa..."
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option>Todas las empresas</option>
          <option>Activas</option>
          <option>Inactivas</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option>Ordenar por nombre</option>
          <option>Ordenar por personal</option>
          <option>Ordenar por áreas</option>
        </select>
      </div>

      {/* Lista de empresas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.organizations.map(org => (
          <div key={org.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              {org.logo && (
                <img
                  src={org.logo}
                  alt={org.nombre}
                  className="w-12 h-12 rounded mr-4"
                />
              )}
              <div>
                <h3 className="font-bold">{org.nombre}</h3>
                <p className="text-sm text-gray-500">ID: {org.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  <div>
                    <p className="text-sm text-gray-500">Personal</p>
                    <p className="font-bold">{org.personal.total} {org.personal.label}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded">
                <div className="flex items-center">
                  <span className="mr-2">🏢</span>
                  <div>
                    <p className="text-sm text-gray-500">Áreas</p>
                    <p className="font-bold">{org.areas.total} {org.areas.label}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded">
                <div className="flex items-center">
                  <span className="mr-2">📊</span>
                  <div>
                    <p className="text-sm text-gray-500">Actividad</p>
                    <p className="font-bold">{org.actividad.total} {org.actividad.label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
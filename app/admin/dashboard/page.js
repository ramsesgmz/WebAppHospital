'use client';
import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('semana');
  const [hoveredArea, setHoveredArea] = useState(null);
  
  // Estadísticas generales del sistema
  const stats = {
    asignacionesPendientes: 24,
    personalActivo: 45,
    areasActivas: 8,
    inventarioTotal: 1234
  };

  // Datos de ejemplo para el inventario
  const inventarioStats = {
    suministrosMedicos: {
      total: 450,
      bajoStock: 5,
      porVencer: 12
    },
    equipoLimpieza: {
      total: 280,
      bajoStock: 8,
      porVencer: 0
    },
    uniformes: {
      total: 324,
      bajoStock: 15,
      porVencer: 0
    }
  };

  // Datos para las estadísticas de asignaciones
  const asignacionesStats = {
    semanal: [
      { dia: 'Lun', completadas: 12, pendientes: 3 },
      { dia: 'Mar', completadas: 15, pendientes: 4 },
      { dia: 'Mie', completadas: 8, pendientes: 6 },
      { dia: 'Jue', completadas: 14, pendientes: 2 },
      { dia: 'Vie', completadas: 10, pendientes: 5 }
    ],
    rendimientoPorArea: {
      'Área de Emergencias': 92,
      'Área de Consultas': 88,
      'Área de Laboratorio': 95,
      'Área de Farmacia': 85
    }
  };

  // Nuevos datos para estadísticas adicionales
  const statsAdicionales = {
    tiempoPromedioTarea: '45min',
    tasaCompletitud: 87,
    incidentesPendientes: 3,
    equiposMantenimiento: 5
  };

  // Datos para el análisis de inventario
  const inventarioTendencias = [
    { mes: 'Ene', consumo: 245, reposicion: 200 },
    { mes: 'Feb', consumo: 320, reposicion: 280 },
    { mes: 'Mar', consumo: 280, reposicion: 300 },
    { mes: 'Abr', consumo: 290, reposicion: 270 },
    { mes: 'May', consumo: 310, reposicion: 320 }
  ];

  // Datos de productividad por turno
  const productividadTurnos = {
    mañana: { completadas: 45, eficiencia: 92 },
    tarde: { completadas: 38, eficiencia: 88 },
    noche: { completadas: 28, eficiencia: 85 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header con selector de período */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-gray-600 mt-2">Resumen general del sistema</p>
          </div>
          <div className="flex gap-2">
            {['día', 'semana', 'mes'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${selectedPeriod === period 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tarjetas de Estadísticas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Asignaciones Pendientes</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.asignacionesPendientes}</p>
                <p className="text-xs text-green-600 mt-1">+12% vs ayer</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Personal Activo</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.personalActivo}</p>
                <p className="text-xs text-green-600 mt-1">+5% vs ayer</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Tiempo Promedio</h2>
                <p className="text-3xl font-bold text-gray-900">{statsAdicionales.tiempoPromedioTarea}</p>
                <p className="text-xs text-purple-600 mt-1">Por tarea completada</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Eficiencia Global</h2>
                <p className="text-3xl font-bold text-gray-900">{statsAdicionales.tasaCompletitud}%</p>
                <p className="text-xs text-yellow-600 mt-1">Tasa de completitud</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nueva sección de análisis detallado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Panel de Productividad por Turno */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Productividad por Turno</h3>
            </div>
            <div className="p-6">
              {Object.entries(productividadTurnos).map(([turno, datos]) => (
                <div key={turno} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="capitalize text-gray-700">{turno}</span>
                    <span className="text-sm font-medium text-blue-600">
                      {datos.completadas} tareas
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-grow h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${datos.eficiencia}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">{datos.eficiencia}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel de Tendencias de Inventario */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Tendencias de Inventario</h3>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inventarioTendencias}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="consumo" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="reposicion" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Paneles principales con más interactividad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Asignaciones con tabs */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Estado de Asignaciones</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-3 3m0 0h-3.75M12 9a3 3 0 113-3m0 0h3.75M9 12a3 3 0 11-3 3m0 0h-3.75M21 12a9 9 0 11-9 9m9-9a9 9 0 00-9-9z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-3 3m0 0h-3.75M12 9a3 3 0 113-3m0 0h3.75M9 12a3 3 0 11-3 3m0 0h-3.75M21 12a9 9 0 11-9 9m9-9a9 9 0 00-9-9z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={asignacionesStats.semanal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '0.5rem',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="completadas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pendientes" fill="#F87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Panel de Rendimiento por Área con hover effects */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Rendimiento por Área</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {Object.entries(asignacionesStats.rendimientoPorArea).map(([area, porcentaje]) => (
                  <div 
                    key={area} 
                    className="space-y-2 hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onMouseEnter={() => setHoveredArea(area)}
                    onMouseLeave={() => setHoveredArea(null)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{area}</span>
                      <span className={`font-bold ${
                        porcentaje >= 90 ? 'text-green-600' :
                        porcentaje >= 80 ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {porcentaje}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          hoveredArea === area ? 'bg-blue-600' : 'bg-blue-500'
                        }`}
                        style={{ 
                          width: `${porcentaje}%`,
                          boxShadow: hoveredArea === area ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
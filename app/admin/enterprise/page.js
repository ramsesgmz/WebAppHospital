'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { FaClock, FaRegCalendarCheck } from 'react-icons/fa';

export default function EnterpriseOverviewPage() {
  const router = useRouter();
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);

  // Datos de áreas
  const areasData = [
    { nombre: 'Urgencias', personal: 8, color: '#EF4444' },
    { nombre: 'UCI', personal: 6, color: '#F59E0B' },
    { nombre: 'Consultas', personal: 10, color: '#3B82F6' },
    { nombre: 'Quirófano', personal: 4, color: '#10B981' },
    { nombre: 'Laboratorio', personal: 7, color: '#6366F1' }
  ];

  // Datos de turnos
  const turnosData = [
    {
      nombre: 'Mañana',
      total: 15,
      activos: 12,
      color: '#3B82F6',
      horario: '6:00 - 14:00',
      personal: [
        { id: 1, nombre: 'Juan Pérez', area: 'Urgencias', estado: 'activo' },
        { id: 2, nombre: 'María López', area: 'UCI', estado: 'activo' },
        { id: 3, nombre: 'Carlos Ruiz', area: 'Consultas', estado: 'inactivo' },
        { id: 4, nombre: 'Ana García', area: 'Quirófano', estado: 'activo' }
      ]
    },
    {
      nombre: 'Tarde',
      total: 12,
      activos: 10,
      color: '#10B981',
      horario: '14:00 - 22:00',
      personal: [
        { id: 5, nombre: 'Pedro Sánchez', area: 'Urgencias', estado: 'activo' },
        { id: 6, nombre: 'Laura Torres', area: 'UCI', estado: 'activo' },
        { id: 7, nombre: 'Miguel Ángel', area: 'Laboratorio', estado: 'activo' }
      ]
    },
    {
      nombre: 'Noche',
      total: 8,
      activos: 7,
      color: '#6366F1',
      horario: '22:00 - 6:00',
      personal: [
        { id: 8, nombre: 'Isabel Díaz', area: 'Urgencias', estado: 'activo' },
        { id: 9, nombre: 'Roberto Martín', area: 'UCI', estado: 'activo' },
        { id: 10, nombre: 'Carmen Vega', area: 'Laboratorio', estado: 'inactivo' }
      ]
    }
  ];

  // Datos de inventario crítico
  const inventarioCritico = [
    { 
      id: 1, 
      nombre: 'Guantes Quirúrgicos', 
      stock: 150, 
      minimo: 200,
      area: 'Quirófano',
      ultimoUso: '2024-02-20',
      estado: 'critico'
    },
    { 
      id: 2, 
      nombre: 'Alcohol Gel', 
      stock: 80, 
      minimo: 100,
      area: 'General',
      ultimoUso: '2024-02-19',
      estado: 'advertencia'
    },
    { 
      id: 3, 
      nombre: 'Mascarillas N95', 
      stock: 50, 
      minimo: 100,
      area: 'UCI',
      ultimoUso: '2024-02-21',
      estado: 'critico'
    },
    { 
      id: 4, 
      nombre: 'Desinfectante', 
      stock: 120, 
      minimo: 150,
      area: 'General',
      ultimoUso: '2024-02-18',
      estado: 'advertencia'
    },
    { 
      id: 5, 
      nombre: 'Batas Desechables', 
      stock: 45, 
      minimo: 100,
      area: 'Quirófano',
      ultimoUso: '2024-02-20',
      estado: 'critico'
    },
    { 
      id: 6, 
      nombre: 'Jabón Antiséptico', 
      stock: 85, 
      minimo: 100,
      area: 'General',
      ultimoUso: '2024-02-17',
      estado: 'advertencia'
    }
  ];

  // Datos de tareas por área expandidos
  const areasTareas = [
    {
      id: 1,
      nombre: 'Urgencias',
      color: '#EF4444',
      tareas: [
        { id: 1, descripcion: 'Limpieza General', estado: 'pendiente', prioridad: 'alta', asignado: 'Juan Pérez' },
        { id: 2, descripcion: 'Desinfección Equipos', estado: 'en_proceso', prioridad: 'media', asignado: 'María López' },
        { id: 3, descripcion: 'Revisión Material', estado: 'completada', prioridad: 'baja', asignado: 'Carlos Ruiz' }
      ]
    },
    {
      id: 2,
      nombre: 'UCI',
      color: '#F59E0B',
      tareas: [
        { id: 4, descripcion: 'Cambio de Turno', estado: 'pendiente', prioridad: 'alta', asignado: 'Ana García' },
        { id: 5, descripcion: 'Limpieza Especial', estado: 'en_proceso', prioridad: 'alta', asignado: 'Pedro Sánchez' }
      ]
    },
    {
      id: 3,
      nombre: 'Quirófano',
      color: '#10B981',
      tareas: [
        { id: 6, descripcion: 'Esterilización', estado: 'en_proceso', prioridad: 'alta', asignado: 'Laura Martínez' },
        { id: 7, descripcion: 'Inventario Instrumental', estado: 'pendiente', prioridad: 'media', asignado: 'Roberto Díaz' }
      ]
    },
    {
      id: 4,
      nombre: 'Laboratorio',
      color: '#6366F1',
      tareas: [
        { id: 8, descripcion: 'Calibración Equipos', estado: 'completada', prioridad: 'alta', asignado: 'Carmen Vega' },
        { id: 9, descripcion: 'Control de Muestras', estado: 'en_proceso', prioridad: 'alta', asignado: 'Miguel Ángel' }
      ]
    },
    {
      id: 5,
      nombre: 'Pediatría',
      color: '#EC4899',
      tareas: [
        { id: 10, descripcion: 'Limpieza Área Infantil', estado: 'pendiente', prioridad: 'media', asignado: 'Isabel Ruiz' },
        { id: 11, descripcion: 'Organización Juguetes', estado: 'completada', prioridad: 'baja', asignado: 'José Torres' }
      ]
    },
    {
      id: 6,
      nombre: 'Farmacia',
      color: '#8B5CF6',
      tareas: [
        { id: 12, descripcion: 'Inventario Medicamentos', estado: 'en_proceso', prioridad: 'alta', asignado: 'Patricia López' },
        { id: 13, descripcion: 'Organización Almacén', estado: 'pendiente', prioridad: 'media', asignado: 'Fernando Gil' }
      ]
    }
  ];

  // Datos de todo el personal
  const allStaff = [
    { id: 1, nombre: 'Juan Pérez', area: 'Urgencias', turno: 'Mañana', rol: 'Limpieza General', estado: 'Activo' },
    { id: 2, nombre: 'María López', area: 'UCI', turno: 'Tarde', rol: 'Supervisor', estado: 'Activo' },
    { id: 3, nombre: 'Carlos Ruiz', area: 'Urgencias', turno: 'Noche', rol: 'Limpieza General', estado: 'Inactivo' },
    { id: 4, nombre: 'Ana García', area: 'Quirófano', turno: 'Mañana', rol: 'Especialista', estado: 'Activo' },
    { id: 5, nombre: 'Pedro Sánchez', area: 'UCI', turno: 'Mañana', rol: 'Supervisor', estado: 'Activo' },
    { id: 6, nombre: 'Laura Torres', area: 'Laboratorio', turno: 'Tarde', rol: 'Técnico', estado: 'Activo' },
    { id: 7, nombre: 'Miguel Ángel', area: 'Farmacia', turno: 'Noche', rol: 'Auxiliar', estado: 'Activo' },
    { id: 8, nombre: 'Isabel Díaz', area: 'Pediatría', turno: 'Mañana', rol: 'Limpieza General', estado: 'Activo' },
    { id: 9, nombre: 'Roberto Martín', area: 'UCI', turno: 'Tarde', rol: 'Especialista', estado: 'Inactivo' },
    { id: 10, nombre: 'Carmen Vega', area: 'Laboratorio', turno: 'Noche', rol: 'Técnico', estado: 'Activo' },
    { id: 11, nombre: 'Fernando Gil', area: 'Urgencias', turno: 'Mañana', rol: 'Auxiliar', estado: 'Activo' },
    { id: 12, nombre: 'Patricia López', area: 'Farmacia', turno: 'Tarde', rol: 'Supervisor', estado: 'Activo' },
    { id: 13, nombre: 'José Torres', area: 'Pediatría', turno: 'Noche', rol: 'Limpieza General', estado: 'Inactivo' },
    { id: 14, nombre: 'Lucía Martínez', area: 'Quirófano', turno: 'Mañana', rol: 'Especialista', estado: 'Activo' },
    { id: 15, nombre: 'Alberto Ruiz', area: 'UCI', turno: 'Tarde', rol: 'Técnico', estado: 'Activo' },
    // ... puedes seguir agregando más personal según necesites
  ];

  // Función para navegar al inventario completo
  const irAInventario = () => {
    router.push('/admin/inventory');
  };

  // Función para navegar a la vista detallada de un área
  const verDetalleArea = (areaId) => {
    router.push(`/admin/assignments/${areaId}`);
  };

  // Función para manejar el clic en "Ver detalle" de un área
  const handleVerDetalle = (area) => {
    setSelectedArea(area);
    setShowAreaModal(true);
  };

  // Componente Modal para el detalle del área
  const AreaDetalleModal = () => {
    if (!selectedArea) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Área: {selectedArea.nombre}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedArea.tareas.length} tareas asignadas
                </p>
              </div>
              <button 
                onClick={() => setShowAreaModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            <div className="space-y-6">
              {/* Sección de Tareas */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Tareas Actuales</h4>
                <div className="space-y-4">
                  {selectedArea.tareas.map((tarea) => (
                    <div key={tarea.id} 
                         className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{tarea.descripcion}</h5>
                          <p className="text-sm text-gray-500">Asignado a: {tarea.asignado}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${tarea.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                              tarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}`}>
                            {tarea.prioridad}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${tarea.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                              tarea.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'}`}>
                            {tarea.estado.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección de Personal Asignado */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Asignado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalPorArea[selectedArea.id]?.map((persona) => (
                    <div key={persona.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {persona.nombre.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{persona.nombre}</p>
                          <p className="text-xs text-gray-500">{persona.turno}</p>
                        </div>
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
  };

  // Datos de personal por área
  const personalPorArea = {
    1: [ // Urgencias
      { id: 1, nombre: 'Juan Pérez', turno: 'Mañana' },
      { id: 2, nombre: 'María López', turno: 'Tarde' },
      { id: 3, nombre: 'Carlos Ruiz', turno: 'Noche' },
      { id: 4, nombre: 'Ana García', turno: 'Mañana' }
    ],
    2: [ // UCI
      { id: 5, nombre: 'Pedro Sánchez', turno: 'Mañana' },
      { id: 6, nombre: 'Laura Torres', turno: 'Tarde' },
      { id: 7, nombre: 'Miguel Ángel', turno: 'Noche' }
    ],
    // ... más personal por área
  };

  // Componente para mostrar todo el personal
  const PersonalTotal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Personal Total del Hospital</h3>
            <p className="text-sm text-gray-500">98 empleados registrados</p>
          </div>
          <button 
            onClick={() => setShowAllStaff(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allStaff.map((empleado) => (
              <div key={empleado.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {empleado.nombre.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {empleado.nombre}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {empleado.rol}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${empleado.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {empleado.estado}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <p>Área: {empleado.area}</p>
                  <p>Turno: {empleado.turno}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const handleDeleteTask = (areaId, tareaId) => {
    setAreasTareas(prev => prev.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          tareas: area.tareas.filter(tarea => tarea.id !== tareaId)
        };
      }
      return area;
    }));
    toast.success("Tarea eliminada correctamente");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Botón para ver todo el personal */}
      <div className="mb-8">
        <button
          onClick={() => setShowAllStaff(true)}
          className="bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow
                   text-gray-700 font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Ver Todo el Personal (98)</span>
        </button>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Turnos */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Turnos Activos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {turnosData.map((turno) => (
              <button
                key={turno.nombre}
                onClick={() => {
                  setSelectedTurno(turno);
                  setShowTurnoModal(true);
                }}
                className="bg-white rounded-xl shadow-lg p-6 transform transition-all 
                         hover:scale-105 hover:shadow-xl focus:outline-none"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{turno.nombre}</h3>
                    <p className="text-sm text-gray-500">{turno.horario}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${turno.color}20`, color: turno.color }}>
                    {turno.activos} activos
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Capacidad</span>
                    <span className="font-medium">{turno.activos}/{turno.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(turno.activos / turno.total) * 100}%`,
                        backgroundColor: turno.color
                      }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Gráfico de Distribución */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Distribución por Áreas
              </h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M4 4v16h16M4 20l16-16M6 16l4-4m4-4l4-4" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico de Dona */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={areasData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="personal"
                    >
                      {areasData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                              <p className="font-medium" style={{ color: data.color }}>
                                {data.nombre}
                              </p>
                              <p className="text-sm text-gray-600">
                                Personal: {data.personal}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Lista de Áreas */}
              <div className="space-y-3">
                {areasData.map((area) => (
                  <div 
                    key={area.nombre}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: area.color }}
                      />
                      <span className="font-medium text-gray-700">
                        {area.nombre}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {area.personal} personal
                      </span>
                      <span className="text-sm font-medium" 
                        style={{ color: area.color }}>
                        {Math.round((area.personal / areasData.reduce((acc, curr) => acc + curr.personal, 0)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Inventario Crítico */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Inventario Crítico</h2>
          <div className="bg-white rounded-xl shadow-lg p-6" style={{ height: '464px' }}>
            <div className="space-y-3">
              {inventarioCritico.slice(0, 4).map((item) => (
                <div key={item.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{item.nombre}</h4>
                      <p className="text-xs text-gray-500">{item.area}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${item.estado === 'critico' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.stock} unidades
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        item.estado === 'critico' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{
                        width: `${Math.min((item.stock / item.minimo) * 100, 100)}%`
                      }}
                    />
                  </div>
                  
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>Último uso: {item.ultimoUso}</span>
                    <span>Mínimo: {item.minimo}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={irAInventario}
              className="mt-6 w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg
                       hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
            >
              Ver Inventario Completo
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Tareas por Área */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tareas por Área</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areasTareas.map((area) => (
            <div
              key={area.id}
              className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow
                border-l-4`} 
              style={{ borderLeftColor: area.color }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold" style={{ color: area.color }}>
                  {area.nombre}
                </h3>
                <span className="text-sm font-medium px-3 py-1 rounded-full" 
                  style={{ 
                    backgroundColor: `${area.color}15`,
                    color: area.color 
                  }}>
                  {area.tareas.length} tareas
                </span>
              </div>

              <div className="space-y-3">
                {area.tareas.map((tarea) => (
                  <div 
                    key={tarea.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">{tarea.descripcion}</h5>
                        <p className="text-sm text-gray-500">Asignado a: {tarea.asignado}</p>
                        <div className="flex flex-col space-y-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <FaClock className="w-3 h-3" />
                            <span>Inicio: {tarea.startTime ? 
                              new Date(tarea.startTime).toLocaleString() : 
                              'No iniciada'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaRegCalendarCheck className="w-3 h-3" />
                            <span>Finalización: {tarea.endTime ? 
                              new Date(tarea.endTime).toLocaleString() : 
                              'En progreso'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(area.id, tarea.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 
                                 transition-colors duration-200"
                        title="Eliminar tarea"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Progreso</span>
                  <span className="font-medium" style={{ color: area.color }}>
                    {area.tareas.filter(t => t.estado === 'completada').length}/{area.tareas.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(area.tareas.filter(t => t.estado === 'completada').length / area.tareas.length) * 100}%`,
                      backgroundColor: area.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actualizar el botón de inventario */}
      <button 
        onClick={irAInventario}
        className="mt-6 w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg
                 hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
      >
        Ver Inventario Completo
      </button>

      {/* Modal de Detalle de Turno */}
      {showTurnoModal && selectedTurno && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  Personal del Turno {selectedTurno.nombre}
                </h3>
                <button 
                  onClick={() => setShowTurnoModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                {selectedTurno.personal.map((persona) => (
                  <div key={persona.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {persona.nombre.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{persona.nombre}</h4>
                        <p className="text-sm text-gray-500">{persona.area}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${persona.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'}`}>
                      {persona.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Personal Total */}
      {showAllStaff && <PersonalTotal />}
      {showAreaModal && <AreaDetalleModal />}
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaRegCalendarCheck } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-hot-toast';

export default function AssignmentClient() {
  // Definición de horarios de turnos
  const turnoHorarios = {
    A: "08:00 AM - 04:00 PM",
    B: "04:00 PM - 12:00 AM",
    C: "12:00 AM - 08:00 AM"
  };

  // Estado para turnos con más información
  const [turnos, setTurnos] = useState({
    A: {
      usuarios: ["Juan Pérez", "Ana Martínez"],
      logueados: 1,
      color: "blue"
    },
    B: {
      usuarios: ["María López", "Carlos Gómez"],
      logueados: 2,
      color: "green"
    },
    C: {
      usuarios: ["Pedro Sánchez"],
      logueados: 0,
      color: "purple"
    }
  });

  // Estado para el turno seleccionado
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Estado para nuevo usuario
  const [newUser, setNewUser] = useState({
    name: "",
    turno: ""
  });

  // AGREGAR AQUÍ LOS NUEVOS ESTADOS
  const [assignments, setAssignments] = useState([
    { user: "Juan Pérez", task: "Limpieza", area: "Área 1", shift: "Turno A" },
    { user: "María López", task: "Mantenimiento", area: "Área 2", shift: "Turno B" },
    { user: "Carlos Gómez", task: "Supervisión", area: "Área 3", shift: "Turno C" },
  ]);

  const [formData, setFormData] = useState({
    user: "",
    task: "",
    area: "",
    date: null,
    duration: "",
    startTime: null,
    endTime: null
  });

  // Lista de usuarios disponibles
  const availableUsers = [
    "Juan Pérez",
    "María López",
    "Carlos Gómez",
    "Ana Martínez",
    "Pedro Sánchez",
    "Laura Torres"
  ];

  // Agregar después de availableUsers
  const areas = [
    {
      id: 1,
      nombre: "Área 1",
      descripcion: "Área de Emergencias",
      responsable: "Juan Pérez",
      estado: "Activa",
      personal: 5,
      color: "blue"
    },
    {
      id: 2,
      nombre: "Área 2",
      descripcion: "Área de Consultas",
      responsable: "María López",
      estado: "Activa",
      personal: 3,
      color: "green"
    },
    {
      id: 3,
      nombre: "Área 3",
      descripcion: "Área de Laboratorio",
      responsable: "Carlos Gómez",
      estado: "Mantenimiento",
      personal: 4,
      color: "purple"
    }
  ];

  // Datos de tareas por área (tomados de Enterprise)
  const [areasTareas, setAreasTareas] = useState([
    {
      id: 1,
      nombre: "Urgencias",
      color: "#EF4444",
      tareas: [
        { 
          id: 1, 
          descripcion: "Limpieza general", 
          asignado: "Juan Pérez",
          prioridad: "alta",
          estado: "pendiente",
          fechaLimite: "2024-03-20"
        },
        { 
          id: 2, 
          descripcion: "Desinfección de equipos", 
          asignado: "María López",
          prioridad: "media",
          estado: "en_proceso",
          fechaLimite: "2024-03-21"
        }
      ]
    },
    {
      id: 2,
      nombre: "UCI",
      color: "#3B82F6",
      tareas: [
        {
          id: 3,
          descripcion: "Mantenimiento de respiradores",
          asignado: "Carlos Gómez",
          prioridad: "alta",
          estado: "en_proceso",
          fechaLimite: "2024-03-22"
        },
        {
          id: 4,
          descripcion: "Revisión de monitores",
          asignado: "Ana García",
          prioridad: "media",
          estado: "completada",
          fechaLimite: "2024-03-19"
        },
        {
          id: 5,
          descripcion: "Limpieza especializada",
          asignado: "Pedro Sánchez",
          prioridad: "alta",
          estado: "pendiente",
          fechaLimite: "2024-03-23"
        }
      ]
    },
    {
      id: 3,
      nombre: "Quirófano",
      color: "#10B981",
      tareas: [
        {
          id: 6,
          descripcion: "Esterilización de instrumentos",
          asignado: "Laura Torres",
          prioridad: "alta",
          estado: "en_proceso",
          fechaLimite: "2024-03-20"
        },
        {
          id: 7,
          descripcion: "Control de inventario",
          asignado: "Miguel Ángel",
          prioridad: "baja",
          estado: "completada",
          fechaLimite: "2024-03-18"
        }
      ]
    },
    {
      id: 4,
      nombre: "Laboratorio",
      color: "#8B5CF6",
      tareas: [
        {
          id: 8,
          descripcion: "Calibración de equipos",
          asignado: "Isabel Díaz",
          prioridad: "media",
          estado: "pendiente",
          fechaLimite: "2024-03-24"
        },
        {
          id: 9,
          descripcion: "Organización de muestras",
          asignado: "Roberto Martín",
          prioridad: "alta",
          estado: "en_proceso",
          fechaLimite: "2024-03-21"
        }
      ]
    },
    {
      id: 5,
      nombre: "Farmacia",
      color: "#F59E0B",
      tareas: [
        {
          id: 10,
          descripcion: "Inventario de medicamentos",
          asignado: "Carmen Vega",
          prioridad: "alta",
          estado: "pendiente",
          fechaLimite: "2024-03-22"
        },
        {
          id: 11,
          descripcion: "Organización de almacén",
          asignado: "Juan Pérez",
          prioridad: "media",
          estado: "completada",
          fechaLimite: "2024-03-19"
        },
        {
          id: 12,
          descripcion: "Control de temperatura",
          asignado: "María López",
          prioridad: "baja",
          estado: "en_proceso",
          fechaLimite: "2024-03-23"
        }
      ]
    },
    {
      id: 6,
      nombre: "Consultas Externas",
      color: "#EC4899",
      tareas: [
        {
          id: 13,
          descripcion: "Limpieza de consultorios",
          asignado: "Pedro Sánchez",
          prioridad: "media",
          estado: "pendiente",
          fechaLimite: "2024-03-25"
        },
        {
          id: 14,
          descripcion: "Mantenimiento de equipos",
          asignado: "Carlos Gómez",
          prioridad: "alta",
          estado: "en_proceso",
          fechaLimite: "2024-03-22"
        }
      ]
    }
  ]);

  // AGREGAR AQUÍ LAS NUEVAS FUNCIONES
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssign = () => {
    if (formData.user && formData.task && formData.area && formData.date) {
      // Crear nueva tarea
      const nuevaTarea = {
        id: Date.now(), // Generar ID único
        descripcion: formData.task,
        asignado: formData.user,
        prioridad: "media", // Valor por defecto
        estado: "pendiente",
        fechaLimite: formData.date.toISOString().split('T')[0],
        startTime: formData.startTime,
        endTime: formData.endTime
      };

      // Actualizar areasTareas
      setAreasTareas(prev => prev.map(area => {
        if (area.nombre === formData.area) {
          return {
            ...area,
            tareas: [...area.tareas, nuevaTarea]
          };
        }
        return area;
      }));

      // Limpiar el formulario
      setFormData({
        user: "",
        task: "",
        area: "",
        date: null,
        duration: "",
        startTime: null,
        endTime: null
      });
      setSelectedDuration(null);
      toast.success("Tarea asignada correctamente");
    } else {
      toast.error("Por favor, completa los campos obligatorios (Usuario, Tarea, Área y Fecha)");
    }
  };

  // Manejadores de eventos existentes
  const handleTurnoClick = (turnoKey) => {
    setSelectedTurno(turnoKey === selectedTurno ? null : turnoKey);
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.turno) {
      setTurnos(prev => ({
        ...prev,
        [newUser.turno]: {
          ...prev[newUser.turno],
          usuarios: [...prev[newUser.turno].usuarios, newUser.name]
        }
      }));
      setNewUser({ name: "", turno: "" });
      setShowAddUserModal(false);
    }
  };

  const handleRemoveUser = (turno, usuario) => {
    setTurnos(prev => ({
      ...prev,
      [turno]: {
        ...prev[turno],
        usuarios: prev[turno].usuarios.filter(u => u !== usuario)
      }
    }));
  };

  // Estado para el modal de área
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAreaModal, setShowAreaModal] = useState(false);

  // Función para manejar el clic en "Ver detalle" de un área
  const handleVerDetalle = (area) => {
    setSelectedArea(area);
    setShowAreaModal(true);
  };

  // Agregar después de la línea 33
  const [showAllStaff, setShowAllStaff] = useState(false);

  // Primero, modificar el estado de personal total (después de los estados iniciales)
  const personalTotal = [
    { id: 1, nombre: 'Juan Pérez', area: 'Urgencias', estado: 'Activo', rol: 'Limpieza General' },
    { id: 2, nombre: 'María López', area: 'UCI', estado: 'Activo', rol: 'Supervisor' },
    { id: 3, nombre: 'Carlos Ruiz', area: 'Urgencias', estado: 'Inactivo', rol: 'Limpieza General' },
    { id: 4, nombre: 'Ana García', area: 'Quirófano', estado: 'Activo', rol: 'Especialista' },
    { id: 5, nombre: 'Pedro Sánchez', area: 'Urgencias', estado: 'Activo', rol: 'Limpieza General' },
    { id: 6, nombre: 'Laura Torres', area: 'UCI', estado: 'Activo', rol: 'Supervisor' },
    { id: 7, nombre: 'Miguel Ángel', area: 'Laboratorio', estado: 'Activo', rol: 'Técnico' },
    { id: 8, nombre: 'Isabel Díaz', area: 'Urgencias', estado: 'Activo', rol: 'Limpieza General' },
    { id: 9, nombre: 'Roberto Martín', area: 'UCI', estado: 'Inactivo', rol: 'Especialista' },
    { id: 10, nombre: 'Carmen Vega', area: 'Laboratorio', estado: 'Activo', rol: 'Técnico' }
  ];

  // Funciones para manejar las tareas
  const actualizarEstadoTarea = (areaId, tareaId, nuevoEstado) => {
    setAreasTareas(prev => prev.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          tareas: area.tareas.map(tarea => {
            if (tarea.id === tareaId) {
              return { ...tarea, estado: nuevoEstado };
            }
            return tarea;
          })
        };
      }
      return area;
    }));
    
    showNotification(`Tarea actualizada a: ${nuevoEstado.replace('_', ' ')}`);
  };

  // Agregar estado para el botón toggle de duración
  const [selectedDuration, setSelectedDuration] = useState(null);

  // Función para manejar la selección de duración
  const handleDurationSelect = (duration) => {
    if (selectedDuration === duration) {
      setSelectedDuration(null);
      setFormData(prev => ({
        ...prev,
        duration: '',
        startTime: null,
        endTime: null
      }));
      return;
    }

    setSelectedDuration(duration);
    const startDate = formData.date;
    let endDate = new Date(startDate);
    
    switch(duration) {
      case 'daily':
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'week':
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'biweekly':
        endDate.setDate(startDate.getDate() + 15);
        break;
      case 'month':
        endDate.setMonth(startDate.getMonth() + 1);
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      duration,
      startTime: startDate,
      endTime: endDate
    }));
  };

  // Agregar función para eliminar tarea
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

  // Actualizar el componente TarjetaArea
  const TarjetaArea = ({ area }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow
      border-l-4`} style={{ borderLeftColor: area.color }}>
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
              {/* Botón de eliminar */}
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

      {/* Barra de progreso */}
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
  );

  // Componente de Turnos Mejorado
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón Ver Todo el Personal - Ahora en la parte superior */}
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

      {/* Grid de 2 columnas para los cuadros principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Cuadro de Turnos */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-6">
            Turnos del Personal
          </h3>
          
          {/* Lista de Turnos */}
          <div className="space-y-4">
            {Object.entries(turnos).map(([turnoKey, turnoData]) => (
              <div
                key={turnoKey}
                onClick={() => handleTurnoClick(turnoKey)}
                className={`
                  border rounded-xl p-4 cursor-pointer transition-all duration-200
                  ${selectedTurno === turnoKey ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'}
                  ${turnoKey === 'A' ? 'bg-blue-50' : turnoKey === 'B' ? 'bg-green-50' : 'bg-purple-50'}
                `}
              >
                {/* Cabecera del Turno */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold">Turno {turnoKey}</h4>
                  <span className="text-sm text-gray-600">{turnoHorarios[turnoKey]}</span>
                </div>

                {/* Información del Turno */}
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{turnoData.usuarios.length} personas asignadas</span>
                  <span>{turnoData.logueados} en línea</span>
                </div>

                {/* Lista de Usuarios (visible solo si el turno está seleccionado) */}
                {selectedTurno === turnoKey && (
                  <div className="mt-3 space-y-2">
                    {turnoData.usuarios.map((usuario, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg">
                        <span>{usuario}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUser(turnoKey, usuario);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botón para Agregar Usuario - Ahora en la parte inferior */}
          <div className="pt-4 mt-auto">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold 
                       shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              Agregar Usuario a Turno
            </button>
          </div>

          {/* Modal para Agregar Usuario */}
          {showAddUserModal && (
            <div className="mt-4 border rounded-xl p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-4">Agregar Usuario</h4>
              <select
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mb-3 p-2 border rounded-lg"
              >
                <option value="">Seleccionar Usuario</option>
                {availableUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
              <select
                value={newUser.turno}
                onChange={(e) => setNewUser(prev => ({ ...prev, turno: e.target.value }))}
                className="w-full mb-3 p-2 border rounded-lg"
              >
                <option value="">Seleccionar Turno</option>
                {Object.keys(turnos).map(turno => (
                  <option key={turno} value={turno}>Turno {turno}</option>
                ))}
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Formulario de Asignación actualizado */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col h-full">
          <h3 className="text-2xl font-semibold text-blue-600 mb-6">
            Nueva Asignación
          </h3>
          
          <form className="flex flex-col flex-grow space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <select
                name="user"
                value={formData.user}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Usuario</option>
                {personalTotal
                  .filter(empleado => empleado.estado === 'Activo')
                  .map(empleado => (
                    <option key={empleado.id} value={empleado.nombre}>
                      {empleado.nombre}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tarea
              </label>
              <select
                name="task"
                value={formData.task}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Tarea</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Supervisión">Supervisión</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Área</option>
                {areasTareas.map(area => (
                  <option key={area.id} value={area.nombre}>
                    {area.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo de fecha con botones de duración */}
            <div className="space-y-4 flex-grow">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Asignación
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <DatePicker
                      selected={formData.date}
                      onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholderText="Seleccionar fecha"
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {/* Botones de duración */}
                  <div className="flex space-x-2">
                    {[
                      { id: 'daily', label: 'Diario' },
                      { id: 'week', label: 'Semanal' },
                      { id: 'biweekly', label: 'Quincenal' },
                      { id: 'month', label: 'Mensual' }
                    ].map(duration => (
                      <button
                        key={duration.id}
                        type="button"
                        onClick={() => handleDurationSelect(duration.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                          ${selectedDuration === duration.id
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {duration.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de Asignar alineado */}
            <div className="pt-4 mt-auto" style={{ marginTop: 'auto' }}>
              <button
                type="button"
                onClick={handleAssign}
                disabled={!formData.user || !formData.task || !formData.area || !formData.date}
                className={`
                  w-full py-3 rounded-xl text-lg font-semibold shadow-md 
                  transition-all duration-200
                  ${(formData.user && formData.task && formData.area && formData.date)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'}
                `}
              >
                Asignar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sección de Tareas por Área */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tareas por Área</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areasTareas.map((area) => (
            <TarjetaArea key={area.id} area={area} />
          ))}
        </div>
      </div>

      {/* Modal de Detalle de Área */}
      {showAreaModal && selectedArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            {/* ... contenido del modal (igual que en Enterprise) ... */}
          </div>
        </div>
      )}

      {/* Modal de Personal Total */}
      {showAllStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Personal Total del Hospital</h3>
                  <p className="text-sm text-gray-500">{personalTotal.length} empleados registrados</p>
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
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalTotal.map((empleado) => (
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

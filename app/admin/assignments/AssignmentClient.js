"use client";

import React, { useState } from "react";

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
    shift: "",
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

  // AGREGAR AQUÍ LAS NUEVAS FUNCIONES
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssign = () => {
    if (formData.user && formData.task && formData.area && formData.shift) {
      setAssignments(prev => [...prev, formData]);
      setFormData({ user: "", task: "", area: "", shift: "" });
    } else {
      alert("Por favor, completa todos los campos antes de asignar.");
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

  // Primero agregamos el estado para el modal de área
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAreaModal, setShowAreaModal] = useState(false);

  // Función para manejar el clic en una tarjeta de área
  const handleAreaClick = (area) => {
    setSelectedArea(area);
    setShowAreaModal(true);
  };

  // Función para cerrar el modal
  const handleCloseAreaModal = () => {
    setSelectedArea(null);
    setShowAreaModal(false);
  };

  // Componente de Turnos Mejorado
  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Grid de 2 columnas para los cuadros principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Cuadro de Turnos */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
          <h3 className="text-2xl font-semibold text-blue-600 mb-6">
            Turnos del Personal
          </h3>
          
          {/* Lista de Turnos */}
          <div className="space-y-4 flex-grow">
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
          <div className="mt-6">
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

        {/* Formulario de Asignación */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
          <h3 className="text-2xl font-semibold text-blue-600 mb-6">
            Nueva Asignación
          </h3>
          <form className="space-y-4 flex-grow">
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
                {availableUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
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
                <option value="Área 1">Área 1</option>
                <option value="Área 2">Área 2</option>
                <option value="Área 3">Área 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turno
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar Turno</option>
                <option value="Turno A">Turno A</option>
                <option value="Turno B">Turno B</option>
                <option value="Turno C">Turno C</option>
              </select>
            </div>

            {/* Botón de Asignar - Ahora en la parte inferior */}
            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={handleAssign}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold 
                         shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Asignar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sección de Áreas */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Áreas del Hospital
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div
              key={area.id}
              onClick={() => handleAreaClick(area)}
              className={`
                bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer
                transform transition-all duration-200 hover:scale-105
                border-t-4 ${
                  area.color === 'blue' 
                    ? 'border-blue-500' 
                    : area.color === 'green' 
                    ? 'border-green-500' 
                    : 'border-purple-500'
                }
              `}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {area.nombre}
                  </h3>
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${area.estado === 'Activa' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }
                  `}>
                    {area.estado}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {area.descripcion}
                </p>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">Responsable:</span>
                      <span className="font-medium text-gray-800">
                        {area.responsable}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">Personal:</span>
                      <span className="font-medium text-gray-800">
                        {area.personal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Área */}
      {showAreaModal && selectedArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedArea.nombre}
              </h3>
              <button
                onClick={handleCloseAreaModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Personal Asignado</h4>
                <p className="text-gray-600">Total: {selectedArea.personal}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Lista de Personal</h4>
                <div className="space-y-2">
                  {/* Aquí puedes mapear la lista real de personal */}
                  {availableUsers.slice(0, selectedArea.personal).map((user, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{user}</span>
                      <button className="text-red-500 hover:text-red-700 text-sm">
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => {/* Función para agregar personal */}}
                >
                  Agregar Personal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

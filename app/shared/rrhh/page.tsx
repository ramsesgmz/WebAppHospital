'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Employee {
  id: number;
  nombre: string;
  cargo: string;
  departamento: string;
  turno: string;
  estado: 'Activo' | 'Inactivo';
  fechaIngreso: string;
  rol: 'usuario' | 'admin' | 'enterprise';
  contacto: {
    email: string;
    telefono: string;
  };
}

interface Turno {
  id: string;
  nombre: string;
  horario: string;
  descripcion: string;
}

export default function RRHHPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados para estadísticas
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    shiftsToday: 0
  });

  // Estados para filtros
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Agregar estos estados
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTurnosModal, setShowTurnosModal] = useState(false);

  // Agregar datos de ejemplo
  const exampleEmployees: Employee[] = [
    {
      id: 1,
      nombre: "Juan Pérez",
      cargo: "Médico General",
      departamento: "Emergencias",
      turno: "Mañana",
      estado: "Activo",
      fechaIngreso: "2024-01-15",
      rol: 'usuario',
      contacto: {
        email: "juan.perez@hospital.com",
        telefono: "0414-1234567"
      }
    },
    {
      id: 2,
      nombre: "María González",
      cargo: "Enfermera",
      departamento: "Quirofano",
      turno: "Tarde",
      estado: "Activo",
      fechaIngreso: "2024-02-01",
      rol: 'usuario',
      contacto: {
        email: "maria.gonzalez@hospital.com",
        telefono: "0424-7654321"
      }
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      cargo: "Especialista",
      departamento: "Consulta",
      turno: "Mañana",
      estado: "Activo",
      fechaIngreso: "2024-01-20",
      rol: 'usuario',
      contacto: {
        email: "carlos.rodriguez@hospital.com",
        telefono: "0412-9876543"
      }
    }
  ];

  // Agregar useEffect para cargar datos de ejemplo
  useEffect(() => {
    setEmployees(exampleEmployees);
    setStats({
      totalEmployees: exampleEmployees.length,
      activeEmployees: exampleEmployees.filter(e => e.estado === 'Activo').length,
      shiftsToday: exampleEmployees.filter(e => e.turno === 'Mañana').length
    });
  }, []);

  // Agregar los modales y sus funciones
  const AddEmployeeModal = () => {
    const [newEmployee, setNewEmployee] = useState({
      nombre: '',
      apellido: '',
      rol: '',
      ubicacion: '',
      username: '',
      password: '',
      confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newEmployee.password !== newEmployee.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }

      const employee: Employee = {
        id: employees.length + 1,
        nombre: `${newEmployee.nombre} ${newEmployee.apellido}`,
        cargo: newEmployee.rol,
        departamento: newEmployee.ubicacion,
        turno: '',
        estado: 'Activo',
        rol: newEmployee.rol as 'usuario' | 'admin' | 'enterprise',
        fechaIngreso: new Date().toISOString().split('T')[0],
        contacto: {
          email: `${newEmployee.username}@hospital.com`,
          telefono: ''
        }
      };
      
      setEmployees([...employees, employee]);
      setShowAddModal(false);
      toast.success('Usuario creado exitosamente');

      // Si es usuario regular, agregarlo al estado de turnos en AssignmentClient
      if (employee.rol === 'usuario') {
        // Aquí deberías implementar la lógica para actualizar AssignmentClient
        // Por ejemplo, usando un contexto global o una API
        const newAssignment = {
          user: employee.nombre,
          task: "",
          area: employee.departamento,
          shift: ""
        };
        
        // Actualizar el estado en AssignmentClient
        setAssignments(prev => [...prev, newAssignment]);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 mx-auto p-8 border w-[600px] shadow-lg rounded-xl bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Crear Nuevo Usuario</h3>
            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newEmployee.nombre}
                  onChange={(e) => setNewEmployee({...newEmployee, nombre: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newEmployee.apellido}
                  onChange={(e) => setNewEmployee({...newEmployee, apellido: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newEmployee.rol}
                  onChange={(e) => setNewEmployee({...newEmployee, rol: e.target.value})}
                  required
                >
                  <option value="">Seleccionar rol</option>
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <select
                  value={newEmployee.ubicacion}
                  onChange={(e) => setNewEmployee({ ...newEmployee, ubicacion: e.target.value })}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar ubicación</option>
                  <option value="Limpieza General">Limpieza General</option>
                  <option value="Almacén">Almacén</option>
                  <option value="Área de Inyección">Área de Inyección</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Control de Calidad">Control de Calidad</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newEmployee.username}
                  onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newEmployee.confirmPassword}
                  onChange={(e) => setNewEmployee({...newEmployee, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Crear Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Definir los turnos disponibles
  const TURNOS: Turno[] = [
    {
      id: 'mañana',
      nombre: 'Turno Mañana',
      horario: '07:00 - 15:00',
      descripcion: 'Turno matutino'
    },
    {
      id: 'tarde',
      nombre: 'Turno Tarde',
      horario: '15:00 - 23:00',
      descripcion: 'Turno vespertino'
    },
    {
      id: 'noche',
      nombre: 'Turno Noche',
      horario: '23:00 - 07:00',
      descripcion: 'Turno nocturno'
    }
  ];

  // Agregar el modal de gestión de turnos
  const TurnosModal = () => {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedTurno, setSelectedTurno] = useState('');

    const handleChangeTurno = (employeeId: number, turnoId: string) => {
      const updatedEmployees = employees.map(emp => {
        if (emp.id === employeeId) {
          return { ...emp, turno: turnoId };
        }
        return emp;
      });
      setEmployees(updatedEmployees);
      toast.success('Turno actualizado exitosamente');
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-8 border w-3/4 shadow-lg rounded-xl bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Gestión de Turnos</h3>
            <button onClick={() => setShowTurnosModal(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Información de turnos */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {TURNOS.map(turno => (
              <div key={turno.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900">{turno.nombre}</h4>
                <p className="text-sm text-gray-500 mt-1">{turno.descripcion}</p>
                <p className="text-sm font-medium text-gray-700 mt-2">{turno.horario}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Personal asignado: {employees.filter(emp => emp.turno === turno.id).length}
                </p>
              </div>
            ))}
          </div>

          {/* Tabla de asignación de turnos */}
          <div className="mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turno Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cambiar Turno
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.nombre}</div>
                      <div className="text-sm text-gray-500">{employee.cargo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {TURNOS.find(t => t.id === employee.turno)?.nombre || employee.turno}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={employee.turno}
                        onChange={(e) => handleChangeTurno(employee.id, e.target.value)}
                      >
                        {TURNOS.map(turno => (
                          <option key={turno.id} value={turno.id}>
                            {turno.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Agregar estos estados
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Agregar estas funciones
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      toast.success('Usuario eliminado exitosamente');
    }
  };

  // Agregar el modal de edición
  const EditEmployeeModal = () => {
    const [editForm, setEditForm] = useState({
      nombre: editingEmployee?.nombre || '',
      rol: editingEmployee?.rol || '',
      ubicacion: editingEmployee?.departamento || '',
      estado: editingEmployee?.estado || 'Activo'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const updatedEmployees = employees.map(emp => {
        if (emp.id === editingEmployee?.id) {
          return {
            ...emp,
            nombre: editForm.nombre,
            rol: editForm.rol as 'usuario' | 'admin' | 'enterprise',
            departamento: editForm.ubicacion,
            estado: editForm.estado as 'Activo' | 'Inactivo'
          };
        }
        return emp;
      });

      setEmployees(updatedEmployees);
      setShowEditModal(false);
      setEditingEmployee(null);
      toast.success('Usuario actualizado exitosamente');
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 mx-auto p-8 border w-[600px] shadow-lg rounded-xl bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Editar Usuario</h3>
            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editForm.nombre}
                onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editForm.rol}
                onChange={(e) => setEditForm({...editForm, rol: e.target.value})}
                required
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editForm.ubicacion}
                onChange={(e) => setEditForm({...editForm, ubicacion: e.target.value})}
                required
              >
                <option value="Emergencias">Emergencias</option>
                <option value="Consulta">Consulta Externa</option>
                <option value="Quirofano">Quirófano</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editForm.estado}
                onChange={(e) => setEditForm({...editForm, estado: e.target.value})}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Encabezado y Filtros */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recursos Humanos</h1>
        
        <div className="flex items-center space-x-4">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm hover:border-blue-500 transition-colors"
          >
            <option value="">Todos los departamentos</option>
            <option value="Emergencias">Emergencias</option>
            <option value="Consulta">Consulta Externa</option>
            <option value="Quirofano">Quirófano</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm hover:border-blue-500 transition-colors"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Personal */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Personal</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
                <p className="text-xs text-blue-600 mt-1">Personal registrado</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Usuario
            </button>
          </div>
        </div>

        {/* Gestión de Turnos */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Turnos Activos</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.shiftsToday}</p>
                <p className="text-xs text-green-600 mt-1">Turnos del día</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTurnosModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Gestionar Turnos
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor de tablas en grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Tabla Principal */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Registrado</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees
                    .filter(emp => emp.rol === 'usuario')
                    .map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                  {employee.nombre.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.nombre}</div>
                              <div className="text-sm text-gray-500">ID: {employee.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.cargo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.departamento}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${employee.estado === 'Activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'}`}>
                            {employee.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEditEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cuadro de Usuarios Especiales */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Usuarios Especiales</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {employees
                .filter(emp => emp.rol === 'admin' || emp.rol === 'enterprise')
                .map(employee => (
                  <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-lg">
                            {employee.nombre.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.nombre}</div>
                        <div className="text-sm text-gray-500">
                          {employee.rol === 'admin' ? 'Administrador' : 'Enterprise'}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleEditEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Paginación con estilo moderno */}
      <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando página <span className="font-medium">{page}</span> de{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Anterior</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Siguiente</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {showAddModal && <AddEmployeeModal />}
      {showEditModal && <EditEmployeeModal />}
      {showTurnosModal && <TurnosModal />}
    </div>
  );
}

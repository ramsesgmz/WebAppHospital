'use client'
import { useState, useMemo } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { DayView } from './DayView'

interface CalendarProps {
  tasks: ScheduledTask[]
  onTaskClick: (task: ScheduledTask) => void
  onAddTask: (date: string) => void
  onDeleteTask: (id: string) => void
}

interface ScheduledTask {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  area: string
  shift: 'A' | 'B' | 'C'
  status: 'pending' | 'completed' | 'cancelled'
  assignedTo: string[]
}

export default function Calendar({ tasks, onTaskClick, onAddTask, onDeleteTask }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedDayTasks, setSelectedDayTasks] = useState<{ date: Date; tasks: ScheduledTask[] } | null>(null);

  // Obtener el primer día del mes actual
  const firstDayOfMonth = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    return date
  }, [currentDate])

  // Obtener el último día del mes actual
  const lastDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  }, [currentDate])

  // Crear array de días del mes con corrección de alineación
  const daysInMonth = useMemo(() => {
    const days = []
    const startDay = firstDayOfMonth.getDay()
    
    // Agregar días del mes anterior para completar la primera semana
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
    
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i)
      days.push({
        date,
        isCurrentMonth: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    // Agregar días del mes actual
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      days.push({
        date,
        isCurrentMonth: true,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    // Agregar días del mes siguiente
    const remainingDays = 42 - days.length // 6 semanas completas
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      days.push({
        date,
        isCurrentMonth: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    return days
  }, [currentDate, firstDayOfMonth, lastDayOfMonth])

  // Agrupar tareas por fecha
  const tasksByDate = useMemo(() => {
    const grouped: { [key: string]: ScheduledTask[] } = {}
    tasks.forEach(task => {
      if (!grouped[task.date]) {
        grouped[task.date] = []
      }
      grouped[task.date].push(task)
    })
    return grouped
  }, [tasks])

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const handleTaskClick = (task: ScheduledTask) => {
    setSelectedTask(task)
    setShowTaskDetails(true)
  }

  // Función para obtener las tareas de un día específico
  const getTasksForDate = (date: Date) => {
    const formattedDate = formatDate(date)
    return tasks.filter(task => task.date === formattedDate)
  }

  // Función para renderizar las tareas en una celda
  const renderCellTasks = (date: Date) => {
    const dayTasks = getTasksForDate(date)
    const MAX_VISIBLE_TASKS = 2
    
    if (dayTasks.length === 0) return null

    return (
      <div className="space-y-1 mt-1">
        {dayTasks.slice(0, MAX_VISIBLE_TASKS).map(task => (
          <button
            key={task.id}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedTask(task)
              setShowTaskDetails(true)
            }}
            className={`w-full text-left text-xs p-1.5 rounded-md truncate transition-colors ${
              task.status === 'completed'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : task.status === 'cancelled'
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-current opacity-60" />
              <span className="font-medium">{task.startTime}</span>
            </div>
            <div className="truncate">{task.title}</div>
          </button>
        ))}
        
        {dayTasks.length > MAX_VISIBLE_TASKS && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedDayTasks({ date, tasks: dayTasks })
            }}
            className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-1"
          >
            Ver {dayTasks.length - MAX_VISIBLE_TASKS} más...
          </button>
        )}
      </div>
    )
  }

  // Función para obtener los días de la semana actual
  const getWeekDays = () => {
    const days = []
    const firstDay = new Date(currentDate)
    firstDay.setDate(currentDate.getDate() - currentDate.getDay())
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDay)
      day.setDate(firstDay.getDate() + i)
      days.push(day)
    }
    return days
  }

  // Función para manejar el cambio de mes
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(event.target.value)
    setSelectedMonth(month)
    setCurrentDate(new Date(selectedYear, month))
  }

  // Función para manejar el cambio de año
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value)
    setSelectedYear(year)
    setCurrentDate(new Date(year, selectedMonth))
  }

  // Renderizar el contenido según la vista seleccionada
  const renderContent = () => {
    switch (view) {
      case 'week':
        return (
          <div className="grid grid-cols-7 flex-1">
            {getWeekDays().map((date, index) => (
              <div
                key={index}
                className={`border-r border-b p-2 ${
                  date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-50' : ''
                }`}
                onClick={() => onAddTask(formatDate(date))}
              >
                <div className="font-medium text-sm mb-1">
                  {date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                </div>
                {renderCellTasks(date)}
              </div>
            ))}
          </div>
        )

      case 'day':
        return (
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {getTasksForDate(currentDate).map(task => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    task.status === 'completed' ? 'bg-green-50 border-green-200' :
                    task.status === 'cancelled' ? 'bg-red-50 border-red-200' :
                    'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedTask(task)
                    setShowTaskDetails(true)
                  }}
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500">
                    {task.startTime} - {task.endTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="grid grid-cols-7 flex-1">
            {/* Cabecera mejorada con los días de la semana */}
            <div className="col-span-7 grid grid-cols-7 bg-gray-50 border-b">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                <div 
                  key={day} 
                  className={`py-3 text-sm font-semibold text-center
                    ${index === 0 || index === 6 ? 'text-blue-600' : 'text-gray-600'}
                    ${index !== 6 ? 'border-r border-gray-200' : ''}
                  `}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            {daysInMonth.map(({ date, isCurrentMonth }, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-3 border-b border-r transition-colors ${
                  isCurrentMonth 
                    ? 'bg-white hover:bg-gray-50'
                    : 'bg-gray-50/50 text-gray-400'
                } ${
                  formatDate(date) === formatDate(new Date())
                    ? 'ring-2 ring-inset ring-blue-500'
                    : ''
                }`}
                onClick={() => onAddTask(formatDate(date))}
              >
                <span className="text-sm font-medium">
                  {date.getDate()}
                </span>
                {renderCellTasks(date)}
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-16rem)]">
      <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col border border-gray-100">
        {/* Header con mejor diseño */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                           rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Hoy
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={currentDate.getMonth()}
                    onChange={handleMonthChange}
                    className="text-base font-semibold text-gray-900 px-3 py-2 bg-white rounded-lg shadow-sm 
                             border border-gray-100/50 hover:shadow-md transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[
                      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ].map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>

                  <select
                    value={currentDate.getFullYear()}
                    onChange={handleYearChange}
                    className="text-base font-semibold text-gray-900 px-3 py-2 bg-white rounded-lg shadow-sm 
                             border border-gray-100/50 hover:shadow-md transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 10 }, (_, i) => 2024 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => onAddTask(formatDate(currentDate))}
                className="px-5 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg font-medium 
                         transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Tarea
              </button>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Panel lateral mejorado */}
      {showTaskDetails && selectedTask && (
        <div className="w-80 bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Detalles de la Tarea</h3>
            <button
              onClick={() => setShowTaskDetails(false)}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Fecha y Hora</p>
              <p className="text-gray-900">{selectedTask.date} ({selectedTask.startTime} - {selectedTask.endTime})</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Área</p>
              <p className="text-gray-900">{selectedTask.area}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Asignado a</p>
              <div className="flex flex-wrap gap-1">
                {selectedTask.assignedTo.map((person, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {person}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Descripción</p>
              <p className="text-sm text-gray-900">{selectedTask.description}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  onTaskClick(selectedTask);
                  setShowTaskDetails(false);
                }}
                className="btn btn-sm btn-primary"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  onDeleteTask(selectedTask.id);
                  setShowTaskDetails(false);
                }}
                className="btn btn-sm btn-error"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de tareas del día */}
      {selectedDayTasks && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Tareas del {selectedDayTasks.date.toLocaleDateString('es-ES', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </h3>
                <button
                  onClick={() => setSelectedDayTasks(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {selectedDayTasks.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task)
                      setShowTaskDetails(true)
                      setSelectedDayTasks(null)
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      task.status === 'completed'
                        ? 'bg-green-50 border-green-200 hover:bg-green-100'
                        : task.status === 'cancelled'
                        ? 'bg-red-50 border-red-200 hover:bg-red-100'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {task.startTime} - {task.endTime}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status === 'completed' ? 'Completado' : 
                         task.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

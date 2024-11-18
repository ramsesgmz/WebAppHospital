'use client'
import { useState, useMemo } from 'react'

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
              setSelectedDate(date)
              setShowTaskDetails(true)
            }}
            className="w-full text-xs text-gray-500 hover:text-gray-700 py-0.5"
          >
            +{dayTasks.length - MAX_VISIBLE_TASKS} más
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

      default: // Vista mensual (ya implementada)
        return (
          <div className="grid grid-cols-7 flex-1">
            {daysInMonth.map(({ date, isCurrentMonth, isWeekend }, index) => (
              <div
                key={index}
                className={`border-r border-b p-2 transition-colors ${
                  isCurrentMonth 
                    ? isWeekend
                      ? 'bg-gray-50 hover:bg-gray-100'
                      : 'bg-white hover:bg-gray-50'
                    : 'bg-gray-100/50 text-gray-400'
                } ${
                  formatDate(date) === formatDate(new Date())
                    ? 'ring-2 ring-inset ring-gray-500'
                    : ''
                }`}
                onClick={() => onAddTask(formatDate(date))}
              >
                <div className={`text-sm font-medium ${
                  isWeekend && isCurrentMonth ? 'text-gray-700' : ''
                }`}>
                  {date.getDate()}
                </div>
                {renderCellTasks(date)}
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-16rem)]">
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
        {/* Header con mejor contraste */}
        <div className="p-4 border-b bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-blue-600 rounded-lg text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h2>
              </div>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-blue-600 rounded-lg text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex gap-3">
              <div className="flex rounded-lg bg-gray-700/50 p-1">
                {['Mes', 'Semana', 'Día'].map((viewType) => (
                  <button
                    key={viewType}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      view.toLowerCase() === viewType.toLowerCase()
                        ? 'bg-white text-gray-800'
                        : 'text-white hover:bg-gray-600'
                    }`}
                    onClick={() => setView(viewType.toLowerCase() as 'month' | 'week' | 'day')}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onAddTask(formatDate(new Date()))}
                className="px-4 py-2 bg-white text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Nueva Tarea
              </button>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Panel lateral con mejor contraste */}
      {showTaskDetails && selectedTask && (
        <div className="w-80 bg-white rounded-lg shadow-lg p-6">
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
    </div>
  )
}

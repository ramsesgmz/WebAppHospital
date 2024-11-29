'use client'
import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import TaskModal from './components/TaskModal'

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

const MOCK_TASKS: ScheduledTask[] = [
  {
    id: '1',
    title: 'Limpieza profunda de equipos',
    description: 'Se realizará una limpieza profunda incluyendo equipos y superficies',
    date: '2024-05-15',
    startTime: '10:00',
    endTime: '11:00',
    area: 'Producción',
    shift: 'A',
    status: 'pending',
    assignedTo: ['Juan Pérez', 'María García']
  }
]

export default function SchedulePage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Mock users - Esto después vendrá de tu base de datos
  const MOCK_USERS = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' },
    { id: '3', name: 'Carlos López' }
  ]

  // Mock areas - Actualizado con las nuevas áreas industriales
  const MOCK_AREAS = [
    { id: '1', name: 'Bioseguridad' },
    { id: '2', name: 'Inyección' },
    { id: '3', name: 'Cuarto Frío' },
    { id: '4', name: 'Producción' },
    { id: '5', name: 'Techos, Paredes y Pisos' },
    { id: '6', name: 'Canaletas y Rejillas' },
    { id: '7', name: 'Área Externa' }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('scheduledTasks')
    setTasks(savedTasks ? JSON.parse(savedTasks) : MOCK_TASKS)
  }, [])

  useEffect(() => {
    localStorage.setItem('scheduledTasks', JSON.stringify(tasks))
  }, [tasks])

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleTaskClick = (task: ScheduledTask) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 w-[90vw] max-w-[1200px] mx-auto px-1 py-1">
        <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500">
          <Calendar 
            tasks={tasks} 
            onTaskClick={handleTaskClick}
            onAddTask={(date) => {
              setSelectedDate(date)
              setSelectedTask(null)
              setIsModalOpen(true)
            }}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        initialDate={selectedDate}
        users={MOCK_USERS}
        areas={MOCK_AREAS}
        onSubmit={(taskData) => {
          if (selectedTask) {
            setTasks(tasks.map(task => 
              task.id === selectedTask.id ? { ...taskData, id: task.id } : task
            ))
          } else {
            setTasks([...tasks, { ...taskData, id: Date.now().toString() }])
          }
          handleCloseModal()
        }}
      />
    </div>
  )
}

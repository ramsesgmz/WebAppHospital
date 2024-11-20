'use client'
import { useState, useEffect, useMemo } from 'react'

interface InventoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: InventoryFormData) => void
  item?: InventoryItem
}

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  location: string
  status: 'available' | 'low' | 'out_of_stock'
  lastUpdated: string
  lastUsed: string
  usageHistory: UsageRecord[]
  restockHistory: RestockRecord[]
  estimatedDuration: number // en días
}

interface UsageRecord {
  id: string
  quantity: number
  date: string
  user: string
}

interface RestockRecord {
  id: string
  quantity: number
  date: string
  supplier: string
}

interface InventoryFormData {
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  location: string
  estimatedDuration: number
}

interface HistoryProps {
  usageHistory: UsageRecord[]
  restockHistory: RestockRecord[]
}

export default function InventoryModal({ isOpen, onClose, onSubmit, item }: InventoryModalProps) {
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    category: 'cleaning',
    quantity: 0,
    unit: '',
    minStock: 0,
    location: '',
    estimatedDuration: 0
  })

  const [usageAmount, setUsageAmount] = useState(0)
  const [restockAmount, setRestockAmount] = useState(0)
  const [supplier, setSupplier] = useState('')
  const [user, setUser] = useState('')

  // Actualizar formData cuando cambia el item
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        minStock: item.minStock,
        location: item.location,
        estimatedDuration: item.estimatedDuration
      })
    } else {
      // Resetear el formulario cuando es nuevo item
      setFormData({
        name: '',
        category: 'cleaning',
        quantity: 0,
        unit: '',
        minStock: 0,
        location: '',
        estimatedDuration: 0
      })
    }
  }, [item])

  // Cálculos de estadísticas usando JavaScript
  const stats = useMemo(() => {
    if (!item) return null

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const dailyStats = last7Days.map(date => {
      const usage = item.usageHistory
        .filter(record => record.date.startsWith(date))
        .reduce((sum, record) => sum + record.quantity, 0)
      
      const restock = item.restockHistory
        .filter(record => record.date.startsWith(date))
        .reduce((sum, record) => sum + record.quantity, 0)

      return {
        date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short' }),
        usage,
        restock
      }
    })

    const totalUsage = item.usageHistory.reduce((sum, record) => sum + record.quantity, 0)
    const totalRestock = item.restockHistory.reduce((sum, record) => sum + record.quantity, 0)
    const stockPercentage = Math.min((item.quantity / item.minStock) * 100, 100)
    const maxDailyValue = Math.max(
      ...dailyStats.map(stat => Math.max(stat.usage, stat.restock))
    )

    return {
      dailyStats,
      totalUsage,
      totalRestock,
      stockPercentage,
      maxDailyValue
    }
  }, [item])

  const handleUseItem = () => {
    if (!item) return
    
    const newUsageRecord: UsageRecord = {
      id: Date.now().toString(),
      quantity: usageAmount,
      date: new Date().toISOString(),
      user: user
    }

    const updatedQuantity = item.quantity - usageAmount
    const updatedItem = {
      ...item,
      quantity: updatedQuantity,
      usageHistory: [newUsageRecord, ...item.usageHistory],
      lastUsed: new Date().toISOString(),
      status: updatedQuantity > item.minStock ? 'available' : 
             updatedQuantity === 0 ? 'out_of_stock' : 'low'
    }

    onSubmit({
      ...formData,
      quantity: updatedQuantity,
      usageHistory: updatedItem.usageHistory,
      lastUsed: updatedItem.lastUsed
    })
    setUsageAmount(0)
    setUser('')
  }

  const handleRestockItem = () => {
    if (!item) return
    
    const newRestockRecord: RestockRecord = {
      id: Date.now().toString(),
      quantity: restockAmount,
      date: new Date().toISOString(),
      supplier: supplier
    }

    const updatedQuantity = item.quantity + restockAmount
    const updatedItem = {
      ...item,
      quantity: updatedQuantity,
      restockHistory: [newRestockRecord, ...item.restockHistory],
      lastUpdated: new Date().toISOString(),
      status: updatedQuantity > item.minStock ? 'available' : 
             updatedQuantity === 0 ? 'out_of_stock' : 'low'
    }

    onSubmit({
      ...formData,
      quantity: updatedQuantity,
      restockHistory: updatedItem.restockHistory,
      lastUpdated: updatedItem.lastUpdated
    })
    setRestockAmount(0)
    setSupplier('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
      <div className="bg-white rounded-lg w-full max-w-[90%] md:max-w-[800px] my-auto">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {item ? 'Editar Item' : 'Nuevo Item'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            {/* Columna izquierda: Formulario principal */}
            <div className="space-y-3">
              <form onSubmit={(e) => {
                e.preventDefault()
                onSubmit(formData)
              }}>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input input-bordered w-full h-8 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="select select-bordered w-full h-8 text-sm"
                    >
                      <option value="cleaning">Limpieza</option>
                      <option value="safety">Seguridad</option>
                      <option value="tools">Herramientas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="input input-bordered w-full h-8 text-sm"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="input input-bordered w-full h-8 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                      className="input input-bordered w-full h-8 text-sm"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input input-bordered w-full h-8 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración Estimada</label>
                    <input
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: Number(e.target.value) })}
                      className="input input-bordered w-full h-8 text-sm"
                      required
                      min="0"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full h-8">
                    {item ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>

            {/* Columna central: Registros */}
            <div className="space-y-3">
              {/* Registrar Uso */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-red-600">Registrar Uso</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
                    <input
                      type="number"
                      className="input input-bordered w-full h-8 text-sm"
                      value={usageAmount}
                      onChange={(e) => setUsageAmount(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                    <input
                      type="text"
                      className="input input-bordered w-full h-8 text-sm"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                    />
                  </div>
                </div>
                <button className="btn btn-error btn-sm w-full mt-2 h-8">Registrar Uso</button>
              </div>

              {/* Registrar Reposición */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-green-600">Registrar Reposición</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
                    <input
                      type="number"
                      className="input input-bordered w-full h-8 text-sm"
                      value={restockAmount}
                      onChange={(e) => setRestockAmount(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                    <input
                      type="text"
                      className="input input-bordered w-full h-8 text-sm"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                    />
                  </div>
                </div>
                <button className="btn btn-success btn-sm w-full mt-2 h-8">Registrar Reposición</button>
              </div>
            </div>

            {/* Columna derecha: Historiales */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-red-600">Historial de Uso</h3>
                <div className="text-sm text-gray-500 text-center">
                  No hay registros de uso
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 text-green-600">Historial de Reposición</h3>
                <div className="text-sm text-gray-500 text-center">
                  No hay registros de reposición
                </div>
              </div>
            </div>
          </div>

          {/* Footer con estadísticas */}
          {item && (
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Stock vs. Mínimo</h4>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            item.quantity >= item.minStock ? 'bg-green-500' :
                            item.quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${stats.stockPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      {item.quantity}/{item.minStock}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Movimientos Totales</h4>
                <div className="mt-2 flex justify-between">
                  <span className="text-red-600 font-bold">-{stats.totalUsage}</span>
                  <span className="text-green-600 font-bold">+{stats.totalRestock}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Duración Estimada</h4>
                <div className="mt-2 text-2xl font-bold text-blue-600">
                  {item.estimatedDuration} días
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

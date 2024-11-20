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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-6xl m-4">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">{item ? 'Editar Item' : 'Nuevo Item'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Columna izquierda: Formulario principal */}
          <div className="col-span-4">
            <form onSubmit={(e) => {
              e.preventDefault()
              onSubmit(formData)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="select select-bordered w-full"
                  >
                    <option value="cleaning">Limpieza</option>
                    <option value="safety">Seguridad</option>
                    <option value="tools">Herramientas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="input input-bordered w-full"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unidad</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="input input-bordered w-full"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duración Estimada</label>
                  <input
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: Number(e.target.value) })}
                    className="input input-bordered w-full"
                    required
                    min="0"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  {item ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>

          {/* Columna central: Registros de uso y reposición */}
          {item && (
            <div className="col-span-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Registrar Uso</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={usageAmount}
                        onChange={(e) => setUsageAmount(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Usuario</label>
                      <input
                        type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Nombre del usuario"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseItem}
                    disabled={!usageAmount || !user || usageAmount > item.quantity}
                    className="btn btn-error w-full"
                  >
                    Registrar Uso
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-600">Registrar Reposición</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={restockAmount}
                        onChange={(e) => setRestockAmount(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                      <input
                        type="text"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Nombre del proveedor"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestockItem}
                    disabled={!restockAmount || !supplier}
                    className="btn btn-success w-full"
                  >
                    Registrar Reposición
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Columna derecha: Historiales */}
          {item && (
            <div className="col-span-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-red-600">
                  Historial de Uso
                </h3>
                <div className="overflow-y-auto max-h-40">
                  {item.usageHistory.length > 0 ? (
                    item.usageHistory.map((record) => (
                      <div key={record.id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          <span className="font-bold text-red-600">-{record.quantity}</span>
                          <span className="ml-2 text-gray-700">{record.user}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-2">No hay registros de uso</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-green-600">
                  Historial de Reposición
                </h3>
                <div className="overflow-y-auto max-h-40">
                  {item.restockHistory.length > 0 ? (
                    item.restockHistory.map((record) => (
                      <div key={record.id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          <span className="font-bold text-green-600">+{record.quantity}</span>
                          <span className="ml-2 text-gray-700">{record.supplier}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-2">No hay registros de reposición</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas en la parte inferior */}
        {item && stats && (
          <div className="mt-6">
            <div className="grid grid-cols-3 gap-4">
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
          </div>
        )}
      </div>
    </div>
  )
}

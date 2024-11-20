'use client'
import { useState, useEffect } from 'react'
import InventoryModal from './components/InventoryModal'

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

// Agregar aquí los datos mock
const MOCK_ITEMS: InventoryItem[] = [
  {
    id: '1',
    name: 'Jabón líquido',
    category: 'cleaning',
    quantity: 50,
    unit: 'litros',
    minStock: 20,
    location: 'Almacén A',
    status: 'available',
    lastUpdated: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    estimatedDuration: 30,
    usageHistory: [
      {
        id: '1',
        quantity: 2,
        date: '2024-01-10',
        user: 'Juan Pérez'
      }
    ],
    restockHistory: [
      {
        id: '1',
        quantity: 10,
        date: '2024-01-15',
        supplier: 'Limpieza SA'
      }
    ]
  },
  {
    id: '2',
    name: 'Guantes de látex',
    category: 'safety',
    quantity: 15,
    unit: 'cajas',
    minStock: 25,
    location: 'Almacén B',
    status: 'low',
    lastUpdated: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    estimatedDuration: 30,
    usageHistory: [],
    restockHistory: []
  },
  {
    id: '3',
    name: 'Alcohol 70%',
    category: 'cleaning',
    quantity: 0,
    unit: 'litros',
    minStock: 30,
    location: 'Almacén A',
    status: 'out_of_stock',
    lastUpdated: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    estimatedDuration: 30,
    usageHistory: [],
    restockHistory: []
  }
]

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'cleaning': return 'Limpieza'
    case 'safety': return 'Seguridad'
    case 'tools': return 'Herramientas'
    default: return category
  }
}

export default function InventoryPage() {
  // Estado para el ordenamiento
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryItem;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  // Inicializar items con un array vacío
  const [items, setItems] = useState<InventoryItem[]>([])

  // Cargar datos en un useEffect
  useEffect(() => {
    const savedItems = localStorage.getItem('inventoryItems')
    setItems(savedItems ? JSON.parse(savedItems) : MOCK_ITEMS)
  }, [])

  // Función para ordenar items
  const sortedItems = [...items].sort((a, b) => {
    if (sortConfig.key === 'status') {
      const statusOrder = { available: 0, low: 1, out_of_stock: 2 }
      const comparison = statusOrder[a.status] - statusOrder[b.status]
      return sortConfig.direction === 'asc' ? comparison : -comparison
    }

    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  // Función para cambiar el ordenamiento
  const requestSort = (key: keyof InventoryItem) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>()
  const [search, setSearch] = useState('')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Inventario</h1>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 min-w-[300px]">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, categoría o ubicación..."
                    className="w-full px-10 py-2.5 
                             border border-gray-200 rounded-lg
                             text-gray-600 text-base
                             placeholder-gray-400
                             bg-white
                             shadow-sm
                             focus:ring-2 focus:ring-blue-100 
                             focus:border-blue-400
                             transition-all duration-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>

                <button 
                  className="flex items-center gap-2 px-4 py-2.5
                           bg-blue-500 hover:bg-blue-600
                           text-white font-medium
                           rounded-lg shadow-sm
                           transition-colors duration-200"
                  onClick={() => {
                    setSelectedItem(undefined)
                    setIsModalOpen(true)
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nuevo Item</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'name', label: 'Nombre' },
                    { key: 'category', label: 'Categoría' },
                    { key: 'quantity', label: 'Stock' },
                    { key: 'minStock', label: 'Stock Mínimo' },
                    { key: 'location', label: 'Ubicación' },
                    { key: 'status', label: 'Estado' },
                    { key: 'lastUpdated', label: 'Última Actualización' }
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => requestSort(key as keyof InventoryItem)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    >
                      <div className="flex items-center gap-2">
                        {label}
                        <span className={`transition-opacity ${
                          sortConfig.key === key ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                        }`}>
                          {sortConfig.key === key && sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedItems
                  .filter(item => 
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.location.toLowerCase().includes(search.toLowerCase()) ||
                    getCategoryLabel(item.category).toLowerCase().includes(search.toLowerCase())
                  )
                  .map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getCategoryLabel(item.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.minStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' :
                          item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'available' ? '✓ Disponible' :
                           item.status === 'low' ? '⚠️ Bajo Stock' :
                           '✕ Sin Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.lastUpdated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsModalOpen(true)
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (confirm('¿Estás seguro de eliminar este item?')) {
                              setItems(items.filter(i => i.id !== item.id))
                            }
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      <InventoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          if (selectedItem) {
            setItems(items.map(item => 
              item.id === selectedItem.id 
                ? { 
                    ...selectedItem,
                    ...data,
                    status: data.quantity > data.minStock ? 'available' : 
                           data.quantity === 0 ? 'out_of_stock' : 'low',
                    lastUpdated: new Date().toISOString()
                  } 
                : item
            ))
          } else {
            const newItem: InventoryItem = {
              ...data,
              id: Date.now().toString(),
              status: data.quantity > data.minStock ? 'available' : 
                     data.quantity === 0 ? 'out_of_stock' : 'low',
              lastUpdated: new Date().toISOString(),
              lastUsed: new Date().toISOString(),
              usageHistory: [],
              restockHistory: []
            }
            setItems([newItem, ...items])
          }
          setIsModalOpen(false)
        }}
        item={selectedItem}
      />
    </div>
  )
}

'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Aquí iría la validación real del token
    const isAuthenticated = true // Para la demo
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [])

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
}

export default function InventoryModal({ isOpen, onClose, onSubmit, item }: InventoryModalProps) {
  const [formData, setFormData] = useState<InventoryFormData>({
    name: item?.name || '',
    category: item?.category || 'cleaning',
    quantity: item?.quantity || 0,
    unit: item?.unit || 'unidades',
    minStock: item?.minStock || 0,
    location: item?.location || ''
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar Item' : 'Nuevo Item'}
        </h2>

        <form onSubmit={(e) => {
          e.preventDefault()
          onSubmit(formData)
          onClose()
        }} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Categoría</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="cleaning">Limpieza</option>
              <option value="tools">Herramientas</option>
              <option value="chemicals">Químicos</option>
              <option value="safety">Seguridad</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Cantidad</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={formData.quantity}
                onChange={e => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                min="0"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Unidad</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.unit}
                onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock Mínimo</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.minStock}
              onChange={e => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
              min="0"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ubicación</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {item ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
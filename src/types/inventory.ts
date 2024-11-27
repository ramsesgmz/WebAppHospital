export interface InventoryItem {
  id: string
  name: string
  category: 'cleaning' | 'tools' | 'chemicals' | 'safety'
  quantity: number
  unit: string
  minStock: number
  location: string
  status: 'available' | 'low' | 'out_of_stock'
  created_at?: string
  updated_at?: string
}

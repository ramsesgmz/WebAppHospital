export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'enterprise' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          role?: 'admin' | 'enterprise' | 'user'
        }
        Update: {
          email?: string
          full_name?: string
          role?: 'admin' | 'enterprise' | 'user'
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed'
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
      }
      inventory: {
        Row: {
          id: string
          name: string
          quantity: number
          min_quantity: number
          category: string
          created_by: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
} 
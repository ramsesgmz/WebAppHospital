import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  assigned_to: z.string().uuid().optional(),
})

export const profileSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'enterprise', 'user']),
})

export const inventorySchema = z.object({
  name: z.string().min(2).max(100),
  quantity: z.number().min(0),
  min_quantity: z.number().min(0),
  category: z.string(),
}) 
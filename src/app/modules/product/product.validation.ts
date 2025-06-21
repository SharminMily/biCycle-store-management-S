import { z } from 'zod';

export const productValidationSchema = z.object({
  name: z.string(),
  brand: z.string(),
  price: z.number().positive('Price must be a positive number'),
  image: z.string().url('Image must be a valid URL'),  
  type: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric']),
  description: z.string(),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  inStock: z.boolean().optional().default(false),
});
export default productValidationSchema;

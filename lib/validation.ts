import { z } from 'zod';

// Product Validation
export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.enum(['Women', 'Kids']),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().min(1, 'Description is required').max(1000),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Order Validation
export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive'),
});

export const CreateOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').max(100),
  phone: z.string().regex(/^\d{7,}$/, 'Please provide a valid phone number'),
  address: z.string().min(1, 'Address is required').max(500),
  notes: z.string().max(500).optional(),
  items: z.array(OrderItemSchema).min(1, 'Order must have at least one item'),
});

// Admin Login Validation
export const AdminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Admin Create Validation
export const CreateAdminSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

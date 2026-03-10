import { z } from 'zod';

export const BranchBodySchema = z.object({
  branchId: z.number().int().optional(),
  headquartersId: z.number().int(),
  name: z.string().trim().min(1, 'Name must be at least 1 character').max(200, 'Name must be at most 200 characters'),
  description: z.string().trim().optional(),
  address: z.string().trim().optional(),
  contactPerson: z.string().trim().optional(),
  email: z.string().trim().email('Invalid email format'),
  phone: z.string().trim().optional(),
});

export const ProductBodySchema = z.object({
  productId: z.number().int().optional(),
  supplierId: z.number().int(),
  name: z.string().trim().min(1, 'Name must be at least 1 character').max(200, 'Name must be at most 200 characters'),
  description: z.string().trim().optional(),
  price: z.number().positive('Price must be greater than 0'),
  sku: z.string().trim().regex(/^[a-zA-Z0-9-]+$/, 'SKU must contain only alphanumeric characters and hyphens'),
  unit: z.string().trim().optional(),
  imgName: z.string().trim().optional(),
  discount: z.number().min(0).max(1).optional(),
});

export const OrderBodySchema = z.object({
  orderId: z.number().int().optional(),
  branchId: z.number().int(),
  orderDate: z.string().trim().datetime({ offset: true }).optional(),
  name: z.string().trim().max(200).optional(),
  description: z.string().trim().optional(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export const DeliveryBodySchema = z.object({
  deliveryId: z.number().int().optional(),
  supplierId: z.number().int(),
  deliveryDate: z.string().trim().datetime({ offset: true }).optional(),
  name: z.string().trim().max(200).optional(),
  description: z.string().trim().optional(),
  status: z.enum(['pending', 'in-transit', 'delivered', 'failed']),
});

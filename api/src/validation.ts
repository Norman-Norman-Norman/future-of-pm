import { NextFunction, Request, Response } from 'express';
import { z, ZodTypeAny } from 'zod';

const stringField = z.string().trim().min(1).max(200);
const longStringField = z.string().trim().min(1).max(2000);
const optionalStringField = z.string().trim().max(200).optional();
const positiveInt = z.number().int().positive();
const nonNegativeInt = z.number().int().min(0);
const positiveNumber = z.number().positive();

export const validateBody = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
    return;
  }

  req.body = result.data;
  next();
};

export const BranchBodySchema = z.object({
  branchId: positiveInt,
  headquartersId: positiveInt,
  name: stringField,
  description: longStringField,
  address: stringField,
  contactPerson: stringField,
  email: z.string().trim().email().max(200),
  phone: stringField
});

export const DeliveryBodySchema = z.object({
  deliveryId: positiveInt,
  supplierId: positiveInt,
  orderId: positiveInt.optional(),
  deliveryDate: stringField,
  scheduledDate: stringField,
  actualDeliveryDate: optionalStringField,
  name: stringField,
  description: longStringField,
  status: z.enum(['pending', 'in-transit', 'delivered', 'failed'])
});

export const DeliveryStatusBodySchema = z.object({
  status: z.enum(['pending', 'in-transit', 'delivered', 'failed'])
}).strict();

export const HeadquartersBodySchema = z.object({
  headquartersId: positiveInt,
  name: stringField,
  description: longStringField,
  address: stringField,
  contactPerson: stringField,
  email: z.string().trim().email().max(200),
  phone: stringField
});

export const OrderBodySchema = z.object({
  orderId: positiveInt,
  branchId: positiveInt,
  orderDate: stringField,
  name: stringField,
  description: longStringField,
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
});

export const OrderDetailBodySchema = z.object({
  orderDetailId: positiveInt,
  orderId: positiveInt,
  productId: positiveInt,
  quantity: positiveInt,
  unitPrice: positiveNumber,
  notes: longStringField
});

export const OrderDetailDeliveryBodySchema = z.object({
  orderDetailDeliveryId: positiveInt,
  orderDetailId: positiveInt,
  deliveryId: positiveInt,
  quantity: positiveInt,
  notes: longStringField
});

const ProductImageSchema = z.object({
  url: stringField,
  alt: stringField,
  isPrimary: z.boolean().optional()
});

const ProductSpecificationSchema = z.object({
  label: stringField,
  value: stringField
});

export const ProductBodySchema = z.object({
  productId: positiveInt,
  supplierId: positiveInt,
  name: stringField,
  description: longStringField,
  price: positiveNumber,
  sku: z.string().trim().regex(/^[A-Za-z0-9-]+$/).max(100),
  unit: stringField,
  imgName: stringField,
  stockLevel: nonNegativeInt,
  reorderPoint: nonNegativeInt,
  discount: z.number().min(0).max(1).optional(),
  category: optionalStringField,
  images: z.array(ProductImageSchema).optional(),
  specifications: z.array(ProductSpecificationSchema).optional()
});

export const SupplierBodySchema = z.object({
  supplierId: positiveInt,
  name: stringField,
  description: longStringField,
  contactPerson: stringField,
  email: z.string().trim().email().max(200),
  phone: stringField
});

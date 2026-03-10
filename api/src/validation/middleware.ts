import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map(e => {
        const path = e.path.length > 0 ? `${e.path.join('.')}: ` : '';
        return `${path}${e.message}`;
      });
      res.status(400).json({ error: 'Validation failed', details });
      return;
    }
    req.body = result.data;
    next();
  };
};

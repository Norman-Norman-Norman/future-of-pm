import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET env variable is not set. Using insecure default — set JWT_SECRET in production.');
}
export const JWT_SECRET = process.env.JWT_SECRET || 'octocat-supply-dev-secret';

export interface AuthPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    console.warn('JWT verification failed:', (err as Error).message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

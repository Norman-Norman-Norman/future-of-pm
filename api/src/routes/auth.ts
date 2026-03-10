import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth';

const router = express.Router();

// Demo users for MVP — replace with a real user store and hashed passwords in production
const users = [
  { userId: 1, email: 'user@octocat.com', password: 'user123', role: 'user' as const },
  { userId: 2, email: 'admin@github.com', password: 'admin123', role: 'admin' as const },
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, role: user.role, email: user.email });
});

export default router;

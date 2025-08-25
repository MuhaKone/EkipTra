import { Router } from 'express';
import { z } from 'zod';
import { findUserByUsername, verifyPassword } from '../core/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { username, password } = parsed.data;
  const user = findUserByUsername(username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (!verifyPassword(password, user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.user = { id: user.id, name: user.name, role: user.role, username: user.username };
  res.json({ user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  res.json({ user: req.session?.user || null });
});

export default router;

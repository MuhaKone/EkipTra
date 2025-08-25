import { Router } from 'express';
import { getDb } from '../db/db.js';
import { requireAuth } from '../core/auth.js';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  const locations = db.prepare('SELECT * FROM locations ORDER BY name').all();
  const suppliers = db.prepare('SELECT * FROM suppliers ORDER BY name').all();
  db.close();
  res.json({ categories, locations, suppliers });
});

export default router;

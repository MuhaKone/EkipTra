import { Router } from 'express';
import { getDb } from '../db/db.js';
import { requireAuth } from '../core/auth.js';

const router = Router();

router.get('/utilization', requireAuth, (req, res) => {
  const db = getDb();
  const used = db.prepare(`SELECT COUNT(*) as c FROM equipments WHERE status = 'checked_out'`).get().c;
  const available = db.prepare(`SELECT COUNT(*) as c FROM equipments WHERE status = 'available'`).get().c;
  const maint = db.prepare(`SELECT COUNT(*) as c FROM equipments WHERE status = 'maintenance'`).get().c;
  const retired = db.prepare(`SELECT COUNT(*) as c FROM equipments WHERE status = 'retired'`).get().c;
  db.close();
  res.json({ used, available, maint, retired });
});

router.get('/overdues', requireAuth, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT c.*, e.code AS equipment_code, e.name AS equipment_name 
    FROM checkouts c JOIN equipments e ON e.id = c.equipment_id
    WHERE c.active = 1 AND c.due_date IS NOT NULL AND date(c.due_date) < date('now')
    ORDER BY c.due_date ASC
  `).all();
  db.close();
  res.json(rows);
});

router.get('/maintenance-costs', requireAuth, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT strftime('%Y-%m', COALESCE(done_date, planned_date)) as period, COALESCE(SUM(cost),0) as total_cost
    FROM maintenances
    GROUP BY period
    ORDER BY period ASC
  `).all();
  db.close();
  res.json(rows);
});

export default router;

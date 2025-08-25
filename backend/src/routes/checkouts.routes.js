import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/db.js';
import { requireAuth, requireRole, audit } from '../core/auth.js';

const router = Router();

const CheckoutSchema = z.object({
  equipment_id: z.number().int(),
  borrower_type: z.enum(['user','location','external']),
  borrower_id: z.number().int().optional().nullable(),
  due_date: z.string().optional().nullable(),
  expected_return_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

router.post('/', requireAuth, requireRole('admin','manager','technician'), (req, res) => {
  const parsed = CheckoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const db = getDb();
  const eq = db.prepare('SELECT * FROM equipments WHERE id = ?').get(parsed.data.equipment_id);
  if (!eq) { db.close(); return res.status(404).json({ error: 'Equipment not found' }); }
  if (eq.status !== 'available') { db.close(); return res.status(400).json({ error: 'Equipment not available' }); }
  const info = db.prepare(`INSERT INTO checkouts(equipment_id, borrower_type, borrower_id, due_date, expected_return_date, notes) 
                           VALUES (@equipment_id,@borrower_type,@borrower_id,@due_date,@expected_return_date,@notes)`)
                  .run(parsed.data);
  db.prepare(`UPDATE equipments SET status='checked_out', updated_at = datetime('now') WHERE id = ?`)
    .run(parsed.data.equipment_id);
  audit(db, req.session.user.id, 'checkout', 'equipments', parsed.data.equipment_id, parsed.data);
  const row = db.prepare('SELECT * FROM checkouts WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json(row);
});

router.post('/:id/return', requireAuth, requireRole('admin','manager','technician'), (req, res) => {
  const db = getDb();
  const ck = db.prepare('SELECT * FROM checkouts WHERE id = ?').get(req.params.id);
  if (!ck || ck.active === 0) { db.close(); return res.status(404).json({ error: 'Checkout not active' }); }
  db.prepare('INSERT INTO returns(checkout_id, condition_notes) VALUES (?, ?)')
    .run(ck.id, req.body?.condition_notes || null);
  db.prepare('UPDATE checkouts SET active = 0 WHERE id = ?').run(ck.id);
  db.prepare(`UPDATE equipments SET status='available', updated_at = datetime('now') WHERE id = ?`).run(ck.equipment_id);
  audit(db, req.session.user.id, 'return', 'equipments', ck.equipment_id, { checkout_id: ck.id });
  db.close();
  res.json({ ok: true });
});

router.get('/overdues', requireAuth, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT c.*, e.code AS equipment_code, e.name AS equipment_name 
    FROM checkouts c 
    JOIN equipments e ON e.id = c.equipment_id
    WHERE c.active = 1 AND c.due_date IS NOT NULL AND date(c.due_date) < date('now')
    ORDER BY c.due_date ASC
  `).all();
  db.close();
  res.json(rows);
});

export default router;

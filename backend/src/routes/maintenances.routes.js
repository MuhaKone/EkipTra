import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/db.js';
import { requireAuth, requireRole, audit } from '../core/auth.js';

const router = Router();

const MaintSchema = z.object({
  equipment_id: z.number().int(),
  type: z.enum(['preventive','corrective']),
  planned_date: z.string().optional().nullable(),
  done_date: z.string().optional().nullable(),
  cost: z.number().optional().nullable(),
  technician: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(['planned','in_progress','done']).default('planned')
});

router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const items = db.prepare(`SELECT m.*, e.code AS equipment_code, e.name AS equipment_name 
                            FROM maintenances m JOIN equipments e ON e.id = m.equipment_id
                            ORDER BY COALESCE(m.planned_date, m.id) DESC`).all();
  db.close();
  res.json(items);
});

router.post('/', requireAuth, requireRole('admin','manager','hse','technician'), (req, res) => {
  const parsed = MaintSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const db = getDb();
  const info = db.prepare(`INSERT INTO maintenances(equipment_id,type,planned_date,done_date,cost,technician,notes,status)
                           VALUES (@equipment_id,@type,@planned_date,@done_date,@cost,@technician,@notes,@status)`)
                 .run(parsed.data);
  if (parsed.data.status !== 'done') {
    db.prepare(`UPDATE equipments SET status='maintenance', updated_at = datetime('now') WHERE id = ?`)
      .run(parsed.data.equipment_id);
  }
  audit(db, req.session.user.id, 'create', 'maintenances', info.lastInsertRowid, parsed.data);
  const row = db.prepare('SELECT * FROM maintenances WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json(row);
});

router.put('/:id', requireAuth, requireRole('admin','manager','hse','technician'), (req, res) => {
  const parsed = MaintSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const db = getDb();
  const fields = Object.keys(parsed.data);
  if (!fields.length) { db.close(); return res.status(400).json({ error:'No fields' }); }
  const sets = fields.map(k => `${k} = @${k}`);
  const info = db.prepare(`UPDATE maintenances SET ${sets.join(', ')} WHERE id = @id`)
                 .run({ ...parsed.data, id: Number(req.params.id) });
  if (!info.changes) { db.close(); return res.status(404).json({ error: 'Not found' }); }
  const row = db.prepare('SELECT * FROM maintenances WHERE id = ?').get(req.params.id);
  if (row.status === 'done') {
    db.prepare(`UPDATE equipments SET status='available', updated_at = datetime('now') WHERE id = ?`)
      .run(row.equipment_id);
  }
  audit(db, req.session.user.id, 'update', 'maintenances', Number(req.params.id), parsed.data);
  db.close();
  res.json(row);
});

export default router;

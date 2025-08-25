import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/db.js';
import { requireAuth, requireRole, audit } from '../core/auth.js';

const router = Router();

const EquipmentSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  category_id: z.number().int(),
  serial_no: z.string().optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  supplier_id: z.number().int().optional().nullable(),
  cost: z.number().optional().nullable(),
  location_id: z.number().int().optional().nullable(),
  status: z.enum(['available','checked_out','maintenance','retired']).optional().default('available'),
  notes: z.string().optional().nullable()
});

router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const { q, status, category_id, location_id, page = 1, pageSize = 50 } = req.query;
  const where = [];
  const params = {};
  if (q) { where.push('(code LIKE @q OR name LIKE @q OR serial_no LIKE @q)'); params.q = `%${q}%`; }
  if (status) { where.push('status = @status'); params.status = status; }
  if (category_id) { where.push('category_id = @category_id'); params.category_id = Number(category_id); }
  if (location_id) { where.push('location_id = @location_id'); params.location_id = Number(location_id); }
  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const offset = (Number(page)-1) * Number(pageSize);
  const items = db.prepare(`SELECT * FROM equipments ${whereSql} ORDER BY id DESC LIMIT @pageSize OFFSET @offset`)
                  .all({ ...params, pageSize: Number(pageSize), offset });
  const total = db.prepare(`SELECT COUNT(*) as c FROM equipments ${whereSql}`).get(params).c;
  db.close();
  res.json({ items, total, page: Number(page), pageSize: Number(pageSize) });
});

router.get('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const eq = db.prepare('SELECT * FROM equipments WHERE id = ?').get(req.params.id);
  const maint = db.prepare('SELECT * FROM maintenances WHERE equipment_id = ? ORDER BY id DESC').all(req.params.id);
  const movements = db.prepare(`SELECT c.*, r.return_date 
                                FROM checkouts c LEFT JOIN returns r ON r.checkout_id = c.id 
                                WHERE c.equipment_id = ? ORDER BY c.id DESC`).all(req.params.id);
  db.close();
  if (!eq) return res.status(404).json({ error: 'Not found' });
  res.json({ equipment: eq, maintenances: maint, movements });
});

router.post('/', requireAuth, requireRole('admin','manager','hse','technician'), (req, res) => {
  const parsed = EquipmentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const db = getDb();
  const stmt = db.prepare(`INSERT INTO equipments(code,name,category_id,serial_no,purchase_date,supplier_id,cost,location_id,status,notes)
                           VALUES (@code,@name,@category_id,@serial_no,@purchase_date,@supplier_id,@cost,@location_id,@status,@notes)`);
  const info = stmt.run(parsed.data);
  audit(db, req.session.user.id, 'create', 'equipments', info.lastInsertRowid, parsed.data);
  const row = db.prepare('SELECT * FROM equipments WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  res.status(201).json(row);
});

router.put('/:id', requireAuth, requireRole('admin','manager','hse','technician'), (req, res) => {
  const parsed = EquipmentSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const db = getDb();
  const fields = Object.keys(parsed.data);
  if (!fields.length) return res.status(400).json({ error: 'No fields' });
  const sets = fields.map(k => `${k} = @${k}`);
  const stmt = db.prepare(`UPDATE equipments SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = @id`);
  const info = stmt.run({ ...parsed.data, id: Number(req.params.id) });
  if (!info.changes) { db.close(); return res.status(404).json({ error: 'Not found' }); }
  audit(db, req.session.user.id, 'update', 'equipments', Number(req.params.id), parsed.data);
  const row = db.prepare('SELECT * FROM equipments WHERE id = ?').get(req.params.id);
  db.close();
  res.json(row);
});

router.delete('/:id', requireAuth, requireRole('admin','manager'), (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM equipments WHERE id = ?').get(req.params.id);
  if (!row) { db.close(); return res.status(404).json({ error: 'Not found' }); }
  db.prepare('DELETE FROM equipments WHERE id = ?').run(req.params.id);
  audit(db, req.session.user.id, 'delete', 'equipments', Number(req.params.id), row);
  db.close();
  res.json({ ok: true });
});

export default router;

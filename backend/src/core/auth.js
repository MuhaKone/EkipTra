import bcrypt from 'bcryptjs';
import { getDb } from '../db/db.js';

export function findUserByUsername(username) {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND active = 1').get(username);
  db.close();
  return user;
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function requireAuth(req, res, next) {
  if (req.session?.user) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session?.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.length || roles.includes(req.session.user.role)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}

export function audit(db, userId, action, entity, entityId, details = {}) {
  db.prepare(`INSERT INTO audit_logs(user_id, action, entity, entity_id, details_json) 
              VALUES (?,?,?,?,json(?))`).run(userId || null, action, entity, entityId || null, JSON.stringify(details));
}

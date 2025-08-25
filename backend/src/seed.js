import 'dotenv/config';
import { getDb } from './db/db.js';
import bcrypt from 'bcryptjs';

const db = getDb();

db.prepare("INSERT OR IGNORE INTO categories(name, code) VALUES (@name,@code)").run({name:'Chantier', code:'CHANT'});
db.prepare("INSERT OR IGNORE INTO categories(name, code) VALUES (@name,@code)").run({name:'Minier', code:'MIN'});
db.prepare("INSERT OR IGNORE INTO categories(name, code) VALUES (@name,@code)").run({name:'HSE', code:'HSE'});
db.prepare("INSERT OR IGNORE INTO locations(name, code) VALUES (@name,@code)").run({name:'Depot Central', code:'DEPOT'});

const adminPass = bcrypt.hashSync('admin123', 12);
db.prepare(`INSERT OR IGNORE INTO users(name, username, password_hash, role) 
            VALUES ('Administrateur', 'admin', ?, 'admin')`).run(adminPass);

console.log('🌱 Seed done (admin/admin123)');
db.close();

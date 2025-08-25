import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DB_PATH = process.env.DB_PATH || './data/app.db';
const backupsDir = path.join(path.dirname(DB_PATH), 'backups');
fs.mkdirSync(backupsDir, { recursive: true });
const stamp = new Date().toISOString().slice(0,10);
const out = path.join(backupsDir, `db_${stamp}.zip`);

try {
  execSync(`zip -j ${out} ${DB_PATH}`, { stdio: 'inherit' });
  console.log('📦 Backup created:', out);
} catch (e) {
  // Fallback to raw copy if zip not available
  const fallback = path.join(backupsDir, `app_${stamp}.db`);
  fs.copyFileSync(DB_PATH, fallback);
  console.log('📄 Backup copied:', fallback);
}

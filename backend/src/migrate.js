import 'dotenv/config';
import { migrate } from './db/db.js';

migrate();
console.log('✅ Migration done');

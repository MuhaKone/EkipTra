import app from './app.js';
import { migrate } from './db/db.js';
import 'dotenv/config';

migrate(); // ensure schema exists

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));

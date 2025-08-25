import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import equipmentsRoutes from './routes/equipments.routes.js';
import checkoutsRoutes from './routes/checkouts.routes.js';
import maintenancesRoutes from './routes/maintenances.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import lookupsRoutes from './routes/lookups.routes.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/equipments', equipmentsRoutes);
app.use('/api/checkouts', checkoutsRoutes);
app.use('/api/maintenances', maintenancesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/lookups', lookupsRoutes);

export default app;

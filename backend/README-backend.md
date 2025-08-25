# EquipTracker Backend (Local/Offline)

API locale Express + SQLite (better-sqlite3).

## Installation

```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
# API: http://localhost:4000
```

Identifiants initiaux : `admin / admin123`

## Endpoints

- `POST /api/auth/login { username, password }`
- `GET /api/equipments` (query: q, status, category_id, location_id, page, pageSize)
- `GET /api/equipments/:id`
- `POST /api/equipments`
- `PUT /api/equipments/:id`
- `DELETE /api/equipments/:id`
- `POST /api/checkouts`
- `POST /api/checkouts/:id/return`
- `GET /api/checkouts/overdues`
- `GET /api/maintenances`
- `POST /api/maintenances`
- `PUT /api/maintenances/:id`
- `GET /api/reports/utilization`
- `GET /api/reports/overdues`
- `GET /api/reports/maintenance-costs`
- `GET /api/lookups`

## Env

Create `.env` (already generated):

```
PORT=4000
DB_PATH=./data/app.db
SESSION_SECRET=...
```

## Backup

```
npm run backup
```

Backups go to `data/backups/`.

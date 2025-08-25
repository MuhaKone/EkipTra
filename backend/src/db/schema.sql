PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','hse','manager','technician','viewer')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact TEXT,
  phone TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS equipments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  serial_no TEXT,
  purchase_date TEXT,
  supplier_id INTEGER REFERENCES suppliers(id),
  cost REAL,
  location_id INTEGER REFERENCES locations(id),
  status TEXT NOT NULL CHECK(status IN ('available','checked_out','maintenance','retired')) DEFAULT 'available',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS checkouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL REFERENCES equipments(id),
  borrower_type TEXT NOT NULL CHECK(borrower_type IN ('user','location','external')),
  borrower_id INTEGER,
  checkout_date TEXT NOT NULL DEFAULT (datetime('now')),
  due_date TEXT,
  expected_return_date TEXT,
  notes TEXT,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS returns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  checkout_id INTEGER NOT NULL REFERENCES checkouts(id),
  return_date TEXT NOT NULL DEFAULT (datetime('now')),
  condition_notes TEXT
);

CREATE TABLE IF NOT EXISTS maintenances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL REFERENCES equipments(id),
  type TEXT NOT NULL CHECK(type IN ('preventive','corrective')),
  planned_date TEXT,
  done_date TEXT,
  cost REAL,
  technician TEXT,
  notes TEXT,
  status TEXT NOT NULL CHECK(status IN ('planned','in_progress','done')) DEFAULT 'planned'
);

CREATE TABLE IF NOT EXISTS attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL REFERENCES equipments(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id INTEGER,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  details_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_eq_code ON equipments(code);
CREATE INDEX IF NOT EXISTS idx_eq_status ON equipments(status);
CREATE INDEX IF NOT EXISTS idx_ck_equipment ON checkouts(equipment_id);
CREATE INDEX IF NOT EXISTS idx_maint_planned ON maintenances(planned_date);

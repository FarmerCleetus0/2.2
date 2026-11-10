// The Worker creates its own tables the first time it handles an API request,
// so there is no separate migration step to run or forget.
export const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    day TEXT NOT NULL,
    name TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'meal',
    kcal INTEGER NOT NULL DEFAULT 0,
    protein REAL NOT NULL DEFAULT 0,
    carbs REAL NOT NULL DEFAULT 0,
    fat REAL NOT NULL DEFAULT 0,
    fiber REAL,
    items TEXT,
    note TEXT,
    photo_key TEXT,
    photo_keys TEXT,
    eaten_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `CREATE INDEX IF NOT EXISTS meals_device_day_idx ON meals (device_id, day)`,
  `CREATE TABLE IF NOT EXISTS saved_labels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    name TEXT NOT NULL,
    serving TEXT,
    kcal INTEGER NOT NULL DEFAULT 0,
    protein REAL NOT NULL DEFAULT 0,
    carbs REAL NOT NULL DEFAULT 0,
    fat REAL NOT NULL DEFAULT 0,
    fiber REAL,
    photo_key TEXT,
    uses INTEGER NOT NULL DEFAULT 1,
    used_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `CREATE INDEX IF NOT EXISTS saved_labels_device_idx ON saved_labels (device_id, used_at)`,
  `CREATE TABLE IF NOT EXISTS app_state (
    device_id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS photos (
    key TEXT PRIMARY KEY,
    device_id TEXT NOT NULL,
    content_type TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS photos_device_idx ON photos (device_id)`,
];

let ready = null;
export function ensureSchema(env) {
  if (!ready) {
    ready = env.DB.batch(STATEMENTS.map((sql) => env.DB.prepare(sql))).catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

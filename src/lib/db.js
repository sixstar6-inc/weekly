import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'weekly_tasks.db');

let dbInstance;

// Initialize DB (Schema)
const initSql = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    system TEXT,
    department TEXT,
    itsm_number TEXT,
    deployment_date TEXT,
    is_confirmed INTEGER DEFAULT 0,
    description TEXT,
    status TEXT,
    remarks TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    change_description TEXT,
    changed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES tasks(id)
  );
`;

// Async Database Adapter
const db = {
  init: async () => {
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
      // Turso (Production)
      if (!dbInstance) {
        dbInstance = createClient({
          url: process.env.TURSO_DATABASE_URL,
          authToken: process.env.TURSO_AUTH_TOKEN,
        });
        await dbInstance.executeMultiple(initSql);
      }
      return 'turso';
    } else {
      // Local SQLite
      if (!dbInstance) {
        dbInstance = new Database(dbPath);
        dbInstance.exec(initSql);
      }
      return 'local';
    }
  },

  all: async (sql, params = []) => {
    await db.init();
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
      const result = await dbInstance.execute({ sql, args: params });
      // Convert Turso result to array of objects
      return result.rows;
    } else {
      return dbInstance.prepare(sql).all(...params);
    }
  },

  get: async (sql, params = []) => {
    await db.init();
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
      const result = await dbInstance.execute({ sql, args: params });
      return result.rows[0] || null;
    } else {
      return dbInstance.prepare(sql).get(...params);
    }
  },

  run: async (sql, params = []) => {
    await db.init();
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
      const result = await dbInstance.execute({ sql, args: params });
      return { lastInsertRowid: result.lastInsertRowid };
    } else {
      const info = dbInstance.prepare(sql).run(...params);
      return { lastInsertRowid: info.lastInsertRowid };
    }
  },

  // Transaction helper (simplified for now, as Turso transactions are more complex via HTTP)
  // For this app, we might need to simplify transactions or use batching if strictly needed.
  // For now, we'll execute sequentially for compatibility.
  transaction: async (callback) => {
    // Note: Real transactions in Turso require interactive transactions which are complex over HTTP.
    // For this simple app, we will just execute the callback.
    // Ideally, we should use dbInstance.batch() for Turso if possible, but logic is inside callback.
    // We will assume the callback uses db.run/db.all which are now async.
    await callback();
  }
};

export default db;

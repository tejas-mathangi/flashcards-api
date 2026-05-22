const db = require('./database');

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      front         TEXT NOT NULL,
      back          TEXT NOT NULL,
      tag           TEXT DEFAULT NULL,
      score         INTEGER DEFAULT 0,
      last_reviewed TEXT DEFAULT NULL,
      created_at    TEXT DEFAULT (datetime('now'))
    )
  `);

  console.log('Database schema ready');
}

module.exports = { createTables };
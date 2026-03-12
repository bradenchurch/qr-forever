import Database from 'better-sqlite3';

let db: Database.Database | null = null;

function getDb() {
  if (!db) {
    db = new Database('rate_limits.sqlite');
    // Initialize the database with a table for rate limiting if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        ip TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0,
        last_reset INTEGER
      );
    `);
  }
  return db;
}

export function checkRateLimit(ip: string): { allowed: boolean, count: number } {
  const db = getDb();

  // Try to find the existing record for this IP
  const row = db.prepare('SELECT count FROM rate_limits WHERE ip = ?').get(ip) as { count: number } | undefined;

  if (row) {
    if (row.count >= 3) {
      return { allowed: false, count: row.count };
    } else {
      // Allowed, increment the count
      db.prepare('UPDATE rate_limits SET count = count + 1 WHERE ip = ?').run(ip);
      return { allowed: true, count: row.count + 1 };
    }
  } else {
    // First time we've seen this IP, allow and set count to 1
    db.prepare('INSERT INTO rate_limits (ip, count, last_reset) VALUES (?, 1, ?)').run(ip, Date.now());
    return { allowed: true, count: 1 };
  }
}

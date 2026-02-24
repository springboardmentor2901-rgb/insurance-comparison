import sqlite3

conn = sqlite3.connect('insurance.db')
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)
""")

cur.execute(
    "INSERT OR IGNORE INTO admin (username, password) VALUES (?, ?)",
    ('admin', 'admin123')
)

conn.commit()
conn.close()

print("✅ Admin table created and default admin added")

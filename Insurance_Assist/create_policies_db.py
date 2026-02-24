import sqlite3

conn = sqlite3.connect("database/insurance.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    policy_name TEXT NOT NULL,
    coverage_amount REAL NOT NULL,
    premium REAL NOT NULL,
    policy_type TEXT NOT NULL,
    description TEXT
)
""")
sample_policies = [
    ("LIC", "Health Plus", 500000, 2500, "Health", "Comprehensive health insurance"),
    ("HDFC Life", "Term Secure", 1000000, 1800, "Life", "Term life insurance"),
    ("ICICI Lombard", "Car Protect", 1000000, 1200, "Vehicle", "Car insurance with zero depreciation"),
    ("Bajaj Allianz", "Travel Safe", 500000, 900, "Travel", "Travel insurance worldwide")
]

cursor.executemany("""
INSERT INTO policies (company_name, policy_name, coverage_amount, premium, policy_type, description)
VALUES (?, ?, ?, ?, ?, ?)
""", sample_policies)


conn.commit()
conn.close()
print("Policies table created successfully ✅")
print("Sample policies inserted ✅")

from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash



def get_db_connection():
    conn = sqlite3.connect('insurance.db')
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__)

# Secret key for sessions (login, forms later)
app.secret_key = "insurance_secret_key"

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"


@app.route("/")
def home():
    return render_template("user/home.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        conn = sqlite3.connect("database/insurance.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
        conn.close()

        if user and check_password_hash(user[3], password):
            flash(f"Welcome, {user[1]}!", "success")
            return redirect(url_for("home"))
        else:
            flash("Invalid email or password!", "danger")
            return redirect(url_for("login"))

    return render_template("auth/login.html")


# Signup route (POST + GET)
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]
        hashed_password = generate_password_hash(password)

        conn = sqlite3.connect("database/insurance.db")
        cursor = conn.cursor()

        try:
            cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                           (name, email, hashed_password))
            conn.commit()
            flash("Account created successfully! Please login.", "success")
            return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            flash("Email already exists!", "danger")
            return redirect(url_for("signup"))
        finally:
            conn.close()

    return render_template("auth/signup.html")

@app.route("/policies")
def policies():
    policy_type = request.args.get("policy_type", "")
    sort_by = request.args.get("sort_by", "")

    conn = sqlite3.connect("database/insurance.db")
    cursor = conn.cursor()

    query = "SELECT * FROM policies"
    params = []

    # Filter
    if policy_type:
        query += " WHERE policy_type=?"
        params.append(policy_type)

    # Sorting
    if sort_by in ["premium", "coverage_amount"]:
        query += f" ORDER BY {sort_by} ASC"

    cursor.execute(query, params)
    policies = cursor.fetchall()
    conn.close()

    return render_template("user/policies.html", policies=policies)

'''@app.route('/admin/admin_add_policy', methods=['GET', 'POST'])
def add_policy():
    if not session.get('admin'):
        return redirect(url_for('admin_login'))

    if request.method == 'POST':
        company_name = request.form['company']
        policy_name = request.form['policy_name']
        coverage_amount = request.form['coverage']
        premium = request.form['premium']
        policy_type = request.form['policy_type']
        description = request.form["description"]


        conn = sqlite3.connect('database/insurance.db')
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO policies (company_name, policy_name, coverage_amount, premium, policy_type, description)
            VALUES (?, ?, ?, ?, ?,?)
        """, (company_name, policy_name, coverage_amount, premium, policy_type, description))
        conn.commit()
        conn.close()

        flash('Policy added successfully!', 'success')
        return redirect(url_for('admin_dashboard'))
    return render_template("admin/admin_add_policy.html")

'''
'''@app.route('/admin/admin_add_policy', methods=['GET', 'POST'])
def admin_add_policy():
    if not session.get('admin_logged_in'):
        flash("Please login first", "warning")
        return redirect(url_for('admin_login'))

    if request.method == 'POST':
        name = request.form['company']
        policy = request.form['policy']
        premium = request.form['premium']
        coverage_amount = request.form['coverage']
        policy_type = request.form['policy_type']
        description = request.form["description"]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO policies (name,policy, premium, coverage_amount, policy_type,description) VALUES (?, ?,?,?,?, ?)",
            (name,policy, premium, coverage_amount, policy_type, description)
        )
        conn.commit()
        conn.close()

        flash("Policy added successfully", "success")
        return redirect(url_for('admin_dashboard'))

    return render_template('admin/admin_add_policy.html')'''


@app.route("/admin/admin_add_policy", methods=["GET", "POST"])
def admin_add_policy():
    if request.method == "POST":
        company_name = request.form.get("company_name")
        policy_name = request.form.get("policy_name")
        coverage_amount = request.form.get("coverage_amount")
        premium = request.form.get("premium")
        policy_type = request.form.get("policy_type")
        description = request.form.get("description")

        # Basic validation
        if not all([company_name, policy_name, coverage_amount, premium, policy_type]):
            flash("All required fields must be filled", "error")
            return redirect(url_for("admin_add_policy"))

        conn = sqlite3.connect("database/insurance.db")
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO policies 
            (company_name, policy_name, coverage_amount, premium, policy_type, description)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            company_name,
            policy_name,
            coverage_amount,
            premium,
            policy_type,
            description
        ))

        conn.commit()
        conn.close()

        flash("Policy added successfully", "success")
        return redirect(url_for("admin_dashboard"))

    return render_template("admin/admin_add_policy.html")




'''@app.route("/admin/edit_policy/<int:id>", methods=["GET", "POST"])
def edit_policy(id):
    conn = sqlite3.connect("database/insurance.db")
    cursor = conn.cursor()

    if request.method == "POST":
        company_name = request.form["company_name"]
        policy_name = request.form["policy_name"]
        coverage_amount = request.form["coverage_amount"]
        premium = request.form["premium"]
        policy_type = request.form["policy_type"]
        description = request.form["description"]

        cursor.execute("""
            UPDATE policies
            SET company_name=?, policy_name=?, coverage_amount=?, premium=?, policy_type=?, description=?
            WHERE id=?
        """, (company_name, policy_name, coverage_amount, premium, policy_type, description, id))
        conn.commit()
        conn.close()
        return redirect("/admin")

    cursor.execute("SELECT * FROM policies WHERE id=?", (id,))
    policy = cursor.fetchone()
    conn.close()
    #return render_template("admin/edit_policy.html", policy=policy)
    return render_template("admin/admin_dashboard.html", policies=policies)'''

'''@app.route('/admin/edit_policy/<int:id>', methods=['GET', 'POST'])
def edit_policy(id):
    conn = sqlite3.connect("database/insurance.db")
    cursor = conn.cursor()

    if request.method == 'POST':
        company_name= request.form['company_name']
        policy_name = request.form['policy_name']
        policy_type = request.form['policy_type']
        coverage_amount = request.form['coverage_amount']
        premium = request.form['premium']

        cursor.execute("""
            UPDATE policies
            SET company_name=?, policy_name=?, policy_type=?, coverage_amount=?, premium=?
            WHERE id=?
        """, (company_name, policy_name, policy_type, coverage_amount, premium, id))

        conn.commit()
        conn.close()
        
        return redirect(url_for('admin_dashboard'))

    cursor.execute("SELECT * FROM policies WHERE id=?", (id,))
    policy = cursor.fetchone()
    conn.close()

    return render_template(
        "admin/edit_policy.html",
        policy=policy
    )'''
@app.route("/admin/edit_policy/<int:id>", methods=["GET", "POST"])
def edit_policy(id):
    conn = sqlite3.connect("database/insurance.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM policies WHERE id = ?", (id,))
    policy = cursor.fetchone()

    if request.method == "POST":
        cursor.execute("""
            UPDATE policies
            SET company_name = ?,
                policy_name = ?,
                coverage_amount = ?,
                premium = ?,
                policy_type = ?,
                description = ?
            WHERE id = ?
        """, (
            request.form["company_name"],
            request.form["policy_name"],
            request.form["coverage_amount"],
            request.form["premium"],
            request.form["policy_type"],
            request.form["description"],
            id
        ))
        conn.commit()
        conn.close()

        flash("Policy updated successfully", "success")
        return redirect(url_for("admin_dashboard"))

    conn.close()
    return render_template("admin/edit_policy.html", policy=policy)



@app.route("/admin/delete_policy/<int:id>")
def delete_policy(id):
    conn = sqlite3.connect("database/insurance.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM policies WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return redirect("/admin")



from flask import Flask, render_template, request, redirect, session, url_for

'''
@app.route('/admin', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = sqlite3.connect('insurance.db')
        cur = conn.cursor()

        cur.execute("SELECT * FROM admin WHERE username=? AND password=?",
                    (username, password))
        admin = cur.fetchone()
        conn.close()

        if admin:
            session['admin'] = True
            flash("Admin login successful", "success")
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Invalid admin credentials", "danger")

    return render_template('admin/admin_login.html')
'''
@app.route('/admin', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id FROM admin WHERE username=? AND password=?",
            (username, password)
        )
        admin = cursor.fetchone()
        conn.close()

        if admin:
            session['admin_logged_in'] = True
            session['admin_id'] = admin[0]
            flash("Admin login successful", "success")
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Invalid admin credentials", "danger")

    return render_template('admin/admin_login.html')

'''
@app.route("/admin/dashboard")
def admin_dashboard():
    conn = sqlite3.connect("database/insurance.db")
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM policies")
    total_policies = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    conn.close()

    return render_template(
        "admin/admin_dashboard.html",
        total_policies=total_policies,
        total_users=total_users
    )
'''

@app.route("/admin/dashboard")
def admin_dashboard():
    conn = sqlite3.connect("database/insurance.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM policies")
    policies = cursor.fetchall()

    cursor.execute("SELECT COUNT(*) FROM policies")
    total_policies = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    conn.close()

    return render_template(
        "admin/admin_dashboard.html",
        policies=policies,
        total_policies=total_policies,
        total_users=total_users
    )


@app.route('/admin/panel')
def admin_panel():
    if not session.get('admin'):
        return redirect('/admin')

    conn = sqlite3.connect("database/insurance.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM policies")
    policies = cursor.fetchall()
    conn.close()

    return render_template("admin/admin_panel.html", policies=policies)

'''@app.route('/admin/logout')
def admin_logout():
    session.pop('admin', None)
    return redirect('/admin')

'''
@app.route('/admin/logout')
def admin_logout():
    session.clear()
    flash("Logged out successfully", "info")
    return redirect(url_for('admin_login'))


import sqlite3

conn = sqlite3.connect("database/insurance.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)
""")

# Insert default admin (only once)
cursor.execute("""
INSERT OR IGNORE INTO admins (username, password)
VALUES (?, ?)
""", ("admin", "admin123"))

conn.commit()
conn.close()

def create_policies_table():
    conn = sqlite3.connect('insurance.db')
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        policy_type TEXT NOT NULL,
        premium REAL NOT NULL,
        coverage TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

create_policies_table()

if __name__ == "__main__":
    app.run(debug=True)



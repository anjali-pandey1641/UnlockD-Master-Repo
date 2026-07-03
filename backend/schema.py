from db import get_connection


def create_tables():
    conn, cur = get_connection()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS accounts(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        balance NUMERIC(12,2) NOT NULL DEFAULT 0
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES accounts(id),
        receiver_id INTEGER REFERENCES accounts(id),
        amount NUMERIC(12,2) NOT NULL,
        category VARCHAR(100),
        status VARCHAR(30),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    cur.execute("""
    ALTER TABLE transactions
    ADD COLUMN IF NOT EXISTS description VARCHAR(255);
    """)

    cur.execute("""
    ALTER TABLE transactions
    ADD COLUMN IF NOT EXISTS merchant VARCHAR(255);
    """)
    cur.execute("""
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
""")

    cur.execute("""
    ALTER TABLE transactions
    ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS budgets(
        id SERIAL PRIMARY KEY,
        account_id INTEGER REFERENCES accounts(id),
        category VARCHAR(100) NOT NULL,
        monthly_limit NUMERIC(12,2) NOT NULL,
        spent NUMERIC(12,2) DEFAULT 0,
        budget_month INTEGER NOT NULL,
        budget_year INTEGER NOT NULL
    );
    """)
    cur.execute("""
CREATE TABLE IF NOT EXISTS group_members(
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id)
);
""")
    cur.execute("""
CREATE TABLE IF NOT EXISTS expenses(
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    payer_id INTEGER REFERENCES accounts(id),
    description VARCHAR(255),
    amount NUMERIC(12,2) NOT NULL,
    split_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

    cur.execute("""
CREATE TABLE IF NOT EXISTS expense_splits(
    id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id),
    amount NUMERIC(12,2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE
);
""")
    cur.execute("""
CREATE TABLE IF NOT EXISTS settlements(
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    from_account INTEGER REFERENCES accounts(id),
    to_account INTEGER REFERENCES accounts(id),
    amount NUMERIC(12,2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE
);
""")
    conn.commit()

    cur.close()
    conn.close()
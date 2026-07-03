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

    conn.commit()

    cur.close()
    conn.close()
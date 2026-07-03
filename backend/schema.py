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
        status VARCHAR(30),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()

    cur.close()
    conn.close()
from flask import Blueprint
from db import get_connection

analytics = Blueprint("analytics", __name__)

@analytics.get("/analytics")
def get_analytics():
    conn, cur = get_connection()

    cur.execute("""
        SELECT
            COUNT(*) AS total_transactions,
            COALESCE(SUM(amount),0) AS total_spending
        FROM transactions
    """)

    total_transactions, total_spending = cur.fetchone()

    cur.execute("""
        SELECT COUNT(*)
        FROM transactions
        WHERE category = 'Food'
    """)

    food_transactions = cur.fetchone()[0]

    cur.execute("""
        SELECT category
        FROM transactions
        WHERE category IS NOT NULL
        GROUP BY category
        ORDER BY COUNT(*) DESC
        LIMIT 1
    """)

    row = cur.fetchone()

    most_used_category = row[0] if row else "N/A"

    cur.close()
    conn.close()

    return {
        "total_transactions": total_transactions,
        "total_spending": float(total_spending),
        "food_transactions": food_transactions,
        "most_used_category": most_used_category,
    }
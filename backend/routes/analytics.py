from flask import Blueprint
from db import get_connection

analytics = Blueprint("analytics", __name__)


@analytics.get("/analytics")
def get_analytics():
    conn, cur = get_connection()

    # Overall statistics
    cur.execute("""
        SELECT
            COUNT(*) AS total_transactions,
            COALESCE(SUM(amount), 0) AS total_spending
        FROM transactions
    """)

    total_transactions, total_spending = cur.fetchone()

    # Food transactions
    cur.execute("""
        SELECT COUNT(*)
        FROM transactions
        WHERE category = 'Food'
    """)

    food_transactions = cur.fetchone()[0]

    # Most used category
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

    # Highest expense
    cur.execute("""
        SELECT
            merchant,
            amount
        FROM transactions
        ORDER BY amount DESC
        LIMIT 1
    """)

    row = cur.fetchone()

    highest_expense = {
        "merchant": row[0] if row else "N/A",
        "amount": float(row[1]) if row else 0,
    }

    # Top 5 merchants
    cur.execute("""
        SELECT
            merchant,
            SUM(amount) AS spent
        FROM transactions
        WHERE merchant IS NOT NULL
          AND merchant <> ''
        GROUP BY merchant
        ORDER BY spent DESC
        LIMIT 5
    """)

    top_merchants = [
        {
            "merchant": merchant,
            "spent": float(spent),
        }
        for merchant, spent in cur.fetchall()
    ]

    # Recurring expenses
    cur.execute("""
        SELECT
            merchant,
            COUNT(*) AS occurrences
        FROM transactions
        WHERE merchant IS NOT NULL
          AND merchant <> ''
        GROUP BY merchant
        HAVING COUNT(*) >= 2
        ORDER BY occurrences DESC
    """)

    recurring_expenses = [
        {
            "merchant": merchant,
            "count": count,
        }
        for merchant, count in cur.fetchall()
    ]
    cur.execute("""
        SELECT
            category,
            COALESCE(SUM(amount),0)
        FROM transactions
        WHERE category IS NOT NULL
        GROUP BY category
        ORDER BY SUM(amount) DESC
    """)

    category_spending = [
        {
            "category": category,
            "amount": float(amount),
        }
        for category, amount in cur.fetchall()
    ]
    cur.close()
    conn.close()

    return {
        "total_transactions": total_transactions,
        "total_spending": float(total_spending),
        "food_transactions": food_transactions,
        "most_used_category": most_used_category,
        "highest_expense": highest_expense,
        "top_merchants": top_merchants,
        "recurring_expenses": recurring_expenses,
        "category_spending": category_spending,
    }
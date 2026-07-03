from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime
from decimal import Decimal

budgets = Blueprint("budgets", __name__)


@budgets.post("/budgets")
def create_budget():
    data = request.get_json()

    account_id = data["account_id"]
    category = data["category"]
    Decimal(data["monthly_limit"])

    now = datetime.now()

    conn, cur = get_connection()

    try:
        cur.execute(
            """
            INSERT INTO budgets
            (account_id, category, monthly_limit, spent, budget_month, budget_year)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                account_id,
                category,
                monthly_limit,
                0,
                now.month,
                now.year,
            ),
        )

        budget_id = cur.fetchone()[0]

        conn.commit()

        return jsonify({
            "id": budget_id,
            "message": "Budget created"
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


@budgets.get("/budgets")
def get_budgets():

    now = datetime.now()

    conn, cur = get_connection()

    try:
        cur.execute(
            """
            UPDATE budgets
            SET spent = 0,
                budget_month = %s,
                budget_year = %s
            WHERE budget_month <> %s
               OR budget_year <> %s
            """,
            (now.month, now.year, now.month, now.year),
        )

        conn.commit()

        cur.execute("""
            SELECT
                id,
                account_id,
                category,
                monthly_limit,
                spent
            FROM budgets
            ORDER BY id
        """)

        rows = cur.fetchall()

        result = []

        for row in rows:
            result.append({
                "id": row[0],
                "account_id": row[1],
                "category": row[2],
                "monthly_limit": float(row[3]),
                "spent": float(row[4]),
                "remaining": float(row[3] - row[4])
            })

        return jsonify(result)

    finally:
        cur.close()
        conn.close()
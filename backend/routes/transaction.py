from flask import Blueprint, request, jsonify, Response
from db import get_connection
import csv
from io import StringIO
from flask import Response
import io
from decimal import Decimal

transactions = Blueprint("transactions", __name__)

MERCHANT_CATEGORY = {
    "dominoes": "Food",
    "dominos": "Food",
    "zomato": "Food",
    "swiggy": "Food",
    "mcdonalds": "Food",
    "pizza hut": "Food",

    "amazon": "Shopping",
    "flipkart": "Shopping",
    "myntra": "Shopping",

    "uber": "Travel",
    "ola": "Travel",

    "netflix": "Entertainment",
    "spotify": "Entertainment",
    "youtube": "Entertainment",

    "electricity": "Bills",
    "water": "Bills",
    "airtel": "Bills",
    "jio": "Bills",
}

@transactions.get("/transactions")
def get_transactions():
    conn, cur = get_connection()

    search = request.args.get("search", "")
    category = request.args.get("category", "")

    cur.execute("""
    SELECT
    t.id,
    t.sender_id,
    s.name AS sender_name,
    t.receiver_id,
    r.name AS receiver_name,
    t.amount,
    t.category,
    t.description,
    t.merchant,
    t.status,
    t.created_at
FROM transactions t
JOIN accounts s
    ON t.sender_id = s.id
JOIN accounts r
    ON t.receiver_id = r.id
    WHERE
    (
        COALESCE(description, '') ILIKE %s
        OR COALESCE(merchant, '') ILIKE %s
    )
    AND
    (
        %s = ''
        OR LOWER(COALESCE(category, '')) = LOWER(%s)
    )
    ORDER BY created_at DESC
    """,
    (
        f"%{search}%",
        f"%{search}%",
        category,
        category
    ))

    rows = cur.fetchall()

    cur.close()
    conn.close()

    data = []

    for row in rows:
        data.append({
        "id": row[0],
        "sender_id": row[1],
        "sender_name": row[2],
        "receiver_id": row[3],
        "receiver_name": row[4],
        "amount": float(row[5]),
        "category": row[6],
        "description": row[7],
        "merchant": row[8],
        "status": row[9],
        "created_at": str(row[10]),
    })

    return jsonify(data)


@transactions.get("/accounts")
def get_accounts():
    conn, cur = get_connection()

    try:
        cur.execute("""
            SELECT id, name, balance
            FROM accounts
            ORDER BY id
        """)

        rows = cur.fetchall()

        data = []

        for row in rows:
            data.append({
                "id": row[0],
                "name": row[1],
                "balance": float(row[2])
            })

        return jsonify(data)

    finally:
        cur.close()
        conn.close()


@transactions.post("/accounts")
def create_account():
    data = request.get_json()
    name = data["name"]
    balance = Decimal(data["balance"])

    conn, cur = get_connection()

    try:
        cur.execute(
            """
            INSERT INTO accounts(name, balance)
            VALUES (%s, %s)
            RETURNING id
            """,
            (name, balance)
        )

        account_id = cur.fetchone()[0]

        conn.commit()

        return jsonify({
            "id": account_id,
            "message": "Account created"
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


@transactions.post("/transfer")
def transfer():
    data = request.get_json()

    sender = data["sender_id"]
    receiver = data["receiver_id"]
    amount = Decimal(data["amount"])
    category = data["category"]

    description = data.get("description")
    merchant = data.get("merchant")

    if amount <= 0:
        return jsonify({"error": "Amount must be greater than zero"}), 400

    if sender == receiver:
        return jsonify({"error": "Sender and receiver cannot be the same"}), 400

    conn, cur = get_connection()

    try:
        cur.execute(
            "SELECT balance FROM accounts WHERE id=%s",
            (sender,)
        )

        sender_balance = cur.fetchone()

        if sender_balance is None:
            return jsonify({"error": "Sender not found"}), 404

        cur.execute(
            "SELECT id FROM accounts WHERE id=%s",
            (receiver,)
        )

        receiver_exists = cur.fetchone()

        if receiver_exists is None:
            return jsonify({"error": "Receiver not found"}), 404

        if sender_balance[0] < amount:
            return jsonify({"error": "Insufficient balance"}), 400

        cur.execute(
            "UPDATE accounts SET balance = balance - %s WHERE id=%s",
            (amount, sender)
        )

        cur.execute(
            "UPDATE accounts SET balance = balance + %s WHERE id=%s",
            (amount, receiver)
        )

        cur.execute(
    """
    INSERT INTO transactions
    (
        sender_id,
        receiver_id,
        amount,
        category,
        description,
        merchant,
        status
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """,
    (
        sender,
        receiver,
        amount,
        category,
        description,
        merchant,
        "SUCCESS"
    )
)

        cur.execute(
            """
            UPDATE budgets
            SET spent = spent + %s
            WHERE account_id = %s
              AND category = %s
            """,
            (amount, sender, category)
        )

        cur.execute(
            """
            SELECT monthly_limit, spent
            FROM budgets
            WHERE account_id = %s
              AND category = %s
            """,
            (sender, category)
        )

        budget = cur.fetchone()

        warning = None

        if budget:
            monthly_limit = Decimal(budget[0])
            spent = Decimal(budget[1])

            if spent >= monthly_limit * 0.8:
                warning = "Budget nearly exhausted"

        conn.commit()

        return jsonify({
            "message": "Transfer successful",
            "warning": warning
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()
@transactions.get("/transactions/export")
def export_transactions():
    conn, cur = get_connection()

    cur.execute("""
        SELECT
            sender_id,
            receiver_id,
            amount,
            category,
            description,
            merchant,
            status,
            created_at
        FROM transactions
        ORDER BY created_at DESC
    """)

    rows = cur.fetchall()

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow([
    "sender_id",
    "receiver_id",
    "amount",
    "category",
    "description",
    "merchant",
    "status",
    "created_at"
])

    writer.writerows(rows)

    cur.close()
    conn.close()

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=transactions.csv"
        }
    )
@transactions.post("/transactions/import")
def import_transactions():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    stream = io.StringIO(file.stream.read().decode("utf-8"))
    reader = csv.DictReader(stream)

    conn, cur = get_connection()

    imported = 0

    try:
        for row in reader:
            if not row.get("sender_id"):
                continue
            merchant = (row.get("merchant") or "").strip().lower()

            merchant = (row.get("merchant") or "").strip().lower()

            category = row.get("category")

            if not category:
                category = MERCHANT_CATEGORY.get(merchant, "Other")
            cur.execute(
                """
                INSERT INTO transactions
                (
                    sender_id,
                    receiver_id,
                    amount,
                    category,
                    description,
                    merchant,
                    status
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                int(row["sender_id"]),
                int(row["receiver_id"]),
                Decimal(row["amount"]),
                category,
                row.get("description"),
                row.get("merchant"),
                row.get("status", "IMPORTED"),
            )
            )

            imported += 1

        conn.commit()

        return jsonify({
            "message": "Import successful",
            "count": imported
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()
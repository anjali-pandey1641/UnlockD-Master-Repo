from flask import Blueprint, request, jsonify
from db import get_connection

transactions = Blueprint("transactions", __name__)


@transactions.get("/transactions")
def get_transactions():
    conn, cur = get_connection()

    cur.execute("""
        SELECT id,
               sender_id,
               receiver_id,
               amount,
               status,
               created_at
        FROM transactions
        ORDER BY created_at DESC
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    data = []

    for row in rows:
        data.append({
            "id": row[0],
            "sender_id": row[1],
            "receiver_id": row[2],
            "amount": float(row[3]),
            "status": row[4],
            "created_at": str(row[5])
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
    balance = float(data["balance"])

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
    amount = float(data["amount"])

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
            (sender_id, receiver_id, amount, status)
            VALUES (%s, %s, %s, %s)
            """,
            (sender, receiver, amount, "SUCCESS")
        )

        conn.commit()

        return jsonify({
            "message": "Transfer successful"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()
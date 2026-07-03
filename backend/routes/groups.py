from flask import Blueprint, request, jsonify
from db import get_connection
from decimal import Decimal
groups = Blueprint("groups", __name__)
@groups.post("/groups")
def create_group():
    data = request.get_json()

    name = data["name"]

    conn, cur = get_connection()
    cur.execute(
    """
    DELETE FROM settlements
    WHERE group_id = %s
    """,
    (group_id,)
)
    try:
        cur.execute(
            """
            INSERT INTO groups(name)
            VALUES (%s)
            RETURNING id
            """,
            (name,)
        )

        group_id = cur.fetchone()[0]

        conn.commit()

        return jsonify({
            "id": group_id,
            "message": "Group created"
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()
@groups.get("/groups")
def get_groups():
    conn, cur = get_connection()

    try:
        cur.execute("""
            SELECT id, name
            FROM groups
            ORDER BY id
        """)

        rows = cur.fetchall()

        data = []

        for row in rows:
            data.append({
                "id": row[0],
                "name": row[1]
            })

        return jsonify(data)

    finally:
        cur.close()
        conn.close()
@groups.post("/groups/<int:group_id>/members")
def add_member(group_id):
    data = request.get_json()

    account_id = data["account_id"]

    conn, cur = get_connection()

    try:
        cur.execute(
            """
            INSERT INTO group_members(group_id, account_id)
            VALUES (%s, %s)
            RETURNING id
            """,
            (group_id, account_id)
        )

        member_id = cur.fetchone()[0]

        conn.commit()

        return jsonify({
            "id": member_id,
            "message": "Member added"
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()        
        
@groups.post("/groups/<int:group_id>/expenses")
def create_expense(group_id):
    data = request.get_json()

    payer_id = data["payer_id"]
    description = data["description"]
    amount = Decimal(data["amount"])
    split_type = data["split_type"]

    conn, cur = get_connection()

    try:
        cur.execute(
            """
            INSERT INTO expenses
            (group_id, payer_id, description, amount, split_type)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
            """,
            (group_id, payer_id, description, amount, split_type)
        )

        expense_id = cur.fetchone()[0]

        cur.execute(
            """
            SELECT account_id
            FROM group_members
            WHERE group_id = %s
            """,
            (group_id,)
        )

        members = cur.fetchall()

        if split_type == "equal":

            share = amount / len(members)

            for member in members:
                cur.execute(
                    """
                    INSERT INTO expense_splits
                    (expense_id, account_id, amount)
                    VALUES (%s, %s, %s)
                    """,
                    (expense_id, member[0], share)
                )

        elif split_type == "custom":

            splits = data["splits"]

            total = 0

            for split in splits:
                total += float(split["amount"])

            if total != amount:
                return jsonify({
                    "error": "Custom split total must equal expense amount"
                }), 400

            for split in splits:
                cur.execute(
                    """
                    INSERT INTO expense_splits
                    (expense_id, account_id, amount)
                    VALUES (%s, %s, %s)
                    """,
                    (
                        expense_id,
                        split["account_id"],
                        split["amount"]
                    )
                )

        conn.commit()

        return jsonify({
            "id": expense_id,
            "message": "Expense created"
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()
@groups.get("/expenses/<int:expense_id>/splits")
def get_splits(expense_id):

    conn, cur = get_connection()

    try:
        cur.execute("""
            SELECT
                account_id,
                amount,
                paid
            FROM expense_splits
            WHERE expense_id = %s
            ORDER BY account_id
        """, (expense_id,))

        rows = cur.fetchall()

        result = []

        for row in rows:
            result.append({
                "account_id": row[0],
                "amount": float(row[1]),
                "paid": row[2]
            })

        return jsonify(result)

    finally:
        cur.close()
        conn.close()
@groups.get("/groups/<int:group_id>/members")
def get_members(group_id):

    conn, cur = get_connection()

    try:
        cur.execute("""
            SELECT account_id
            FROM group_members
            WHERE group_id = %s
            ORDER BY account_id
        """, (group_id,))

        rows = cur.fetchall()

        return jsonify([
            {"account_id": row[0]}
            for row in rows
        ])

    finally:
        cur.close()
        conn.close()                
@groups.get("/groups/<int:group_id>/settlements")
def get_settlements(group_id):

    conn, cur = get_connection()

    try:

        cur.execute("""
            SELECT payer_id, amount
            FROM expenses
            WHERE group_id = %s
        """, (group_id,))

        expenses = cur.fetchall()

        cur.execute("""
            SELECT account_id, amount
            FROM expense_splits
            WHERE expense_id IN (
                SELECT id
                FROM expenses
                WHERE group_id = %s
            )
        """, (group_id,))

        splits = cur.fetchall()

        balance = {}

        for payer_id, amount in expenses:
            balance[payer_id] = balance.get(payer_id, 0) + float(amount)

        for account_id, amount in splits:
            balance[account_id] = balance.get(account_id, 0) - float(amount)

        creditors = []
        debtors = []

        for account_id, value in balance.items():

            if value > 0:
                creditors.append([account_id, value])

            elif value < 0:
                debtors.append([account_id, -value])

        settlements = []

        i = 0
        j = 0

        while i < len(debtors) and j < len(creditors):

            debtor_id, debt = debtors[i]
            creditor_id, credit = creditors[j]

            pay = min(debt, credit)

            settlements.append({
                "from": debtor_id,
                "to": creditor_id,
                "amount": round(pay, 2),
                "paid": False
            })
            cur.execute(
    """
    INSERT INTO settlements
    (group_id, from_account, to_account, amount)
    VALUES (%s, %s, %s, %s)
    """,
    (
        group_id,
        debtor_id,
        creditor_id,
        pay
    )
)

            debtors[i][1] -= pay
            creditors[j][1] -= pay

            if debtors[i][1] == 0:
                i += 1

            if creditors[j][1] == 0:
                j += 1
        conn.commit()
        return jsonify(settlements)

    finally:
        cur.close()
        conn.close()        
@groups.post("/settlements/<int:settlement_id>/pay")
def pay_settlement(settlement_id):

    conn, cur = get_connection()

    try:

        cur.execute(
            """
            UPDATE settlements
            SET paid = TRUE
            WHERE id = %s
            RETURNING id
            """,
            (settlement_id,)
        )

        row = cur.fetchone()

        if row is None:
            return jsonify({
                "error": "Settlement not found"
            }), 404

        conn.commit()

        return jsonify({
            "id": settlement_id,
            "message": "Settlement marked as paid"
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close() 
@groups.get("/groups/<int:group_id>/settlements/db")
def get_saved_settlements(group_id):

    conn, cur = get_connection()

    try:

        cur.execute(
            """
            SELECT
                id,
                from_account,
                to_account,
                amount,
                paid
            FROM settlements
            WHERE group_id = %s
            ORDER BY id
            """,
            (group_id,)
        )

        rows = cur.fetchall()

        return jsonify([
            {
                "id": row[0],
                "from": row[1],
                "to": row[2],
                "amount": float(row[3]),
                "paid": row[4]
            }
            for row in rows
        ])

    finally:
        cur.close()
        conn.close()               
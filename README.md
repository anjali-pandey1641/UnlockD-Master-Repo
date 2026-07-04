# 💰 UnlockD Finance Manager

A full-stack, Dockerized personal finance management system built with **React + TypeScript**, **Flask**, and **PostgreSQL**.

The application allows users to manage accounts, perform secure money transfers, create budgets, split group expenses, import/export transactions, and analyze spending through a modern dashboard.

---

# 🚀 Features

## 👤 Account Management
- Create bank accounts
- View account balances
- Automatic balance updates

## 💸 Money Transfers
- Transfer money between accounts
- Prevent self-transfers
- Insufficient balance validation
- Budget warning notifications
- Transaction history

## 📊 Budget Management
- Monthly budgets by category
- Budget usage tracking
- Remaining balance calculation
- 80% budget warning
- Backend budget analytics

## 👥 Group Expense Splitting
- Create expense groups
- Add members
- Equal expense splitting
- Custom expense splitting
- Debt simplification algorithm
- Settlement generation
- Mark settlements as paid

## 🧾 Transaction Management
- Transaction descriptions
- Merchant tracking
- Category filtering
- Search by merchant or description
- CSV export
- CSV import

## 📈 Analytics Dashboard
- Total transactions
- Total spending
- Food transaction count
- Most used category
- Backend-powered analytics endpoint

---

# 🛠 Tech Stack

## Frontend
- React
- TypeScript
- Vite
- CSS

## Backend
- Python
- Flask
- psycopg2

## Database
- PostgreSQL

## DevOps
- Docker
- Docker Compose

---

# 📂 Project Structure

```
UnlockD-Master-Repo
│
├── frontend
│   ├── components
│   ├── hooks
│   ├── services
│   ├── App.tsx
│   └── App.css
│
├── backend
│   ├── app.py
│   ├── schema.py
│   ├── db.py
│   ├── analytics.py
│   ├── groups.py
│   ├── budget.py
│   └── transaction.py
│
├── docker-compose.yml
└── README.md
```

---

# 🐳 Running with Docker

Clone the repository

```bash
git clone https://github.com/ad1tyq/UnlockD-Master-Repo.git
```

Go into the project

```bash
cd UnlockD-Master-Repo
```

Run

```bash
docker compose up --build
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 🔌 REST API

## Accounts

```
GET    /accounts
POST   /accounts
```

## Transfers

```
POST   /transfer
```

## Transactions

```
GET    /transactions
GET    /transactions/export
POST   /transactions/import
```

## Budgets

```
GET    /budgets
POST   /budgets
```

## Groups

```
GET    /groups
POST   /groups
POST   /groups/<id>/members
GET    /groups/<id>/members
POST   /groups/<id>/expenses
GET    /groups/<id>/settlements
POST   /settlements/<id>/pay
```

## Analytics

```
GET /analytics
```

---

# 📋 Future Improvements

- PDF bank statement import
- Merchant auto-categorization
- Recurring expense detection
- Interactive charts
- Dark mode
- Toast notifications
- Account profile pages
- Enhanced fraud detection
- Idempotency keys for transfers
- Improved budget history
- Role-based authentication

---

# 👨‍💻 Team

**Team:** Stack Unlockers

Project developed during the UnlockD Full Stack Buildathon.

---

# 📄 License

This project is intended for educational and hackathon purposes.
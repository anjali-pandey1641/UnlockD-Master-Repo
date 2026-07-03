import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [budgetAccount, setBudgetAccount] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  async function fetchAccounts() {
    const response = await fetch("http://localhost:5000/accounts");
    const data = await response.json();
    setAccounts(data);
  }

  async function fetchTransactions() {
    const response = await fetch("http://localhost:5000/transactions");
    const data = await response.json();
    setTransactions(data);
  }

  async function fetchBudgets() {
    const response = await fetch("http://localhost:5000/budgets");
    const data = await response.json();
    setBudgets(data);
  }

  async function createAccount() {
    const response = await fetch("http://localhost:5000/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        balance: Number(balance),
      }),
    });

    if (response.ok) {
      setName("");
      setBalance("");

      fetchAccounts();
      fetchTransactions();
      fetchBudgets();
    } else {
      alert("Failed to create account");
    }
  }

  async function createBudget() {
    const response = await fetch("http://localhost:5000/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_id: Number(budgetAccount),
        category: budgetCategory,
        monthly_limit: Number(budgetLimit),
      }),
    });

    if (response.ok) {
      setBudgetAccount("");
      setBudgetCategory("");
      setBudgetLimit("");

      fetchAccounts();
      fetchTransactions();
      fetchBudgets();
    } else {
      alert("Failed to create budget");
    }
  }

  async function transferMoney() {
    const response = await fetch("http://localhost:5000/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: Number(sender),
        receiver_id: Number(receiver),
        amount: Number(amount),
        category,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.warning) {
        alert(data.warning);
      }

      setSender("");
      setReceiver("");
      setAmount("");
      setCategory("");

      fetchAccounts();
      fetchTransactions();
      fetchBudgets();
    } else {
      alert("Transfer failed");
    }
  }

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
    fetchBudgets();
  }, []);

  return (
    <div className="container">
      <h1>Finance Manager</h1>

      <h2>Create Account</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Initial Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
      />

      <button onClick={createAccount}>Create Account</button>

      <hr />

      <h2>Accounts</h2>

      {accounts.length === 0 ? (
        <p>No accounts yet.</p>
      ) : (
        accounts.map((account: any) => (
          <div key={account.id}>
            <strong>
              #{account.id} {account.name}
            </strong>{" "}
            — ₹{account.balance}
          </div>
        ))
      )}

      <hr />

      <h2>Transfer Money</h2>

      <input
        type="number"
        placeholder="Sender ID"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />

      <input
        type="number"
        placeholder="Receiver ID"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <button onClick={transferMoney}>Transfer</button>

      <hr />

      <h2>Create Budget</h2>

      <input
        type="number"
        placeholder="Account ID"
        value={budgetAccount}
        onChange={(e) => setBudgetAccount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        value={budgetCategory}
        onChange={(e) => setBudgetCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Monthly Limit"
        value={budgetLimit}
        onChange={(e) => setBudgetLimit(e.target.value)}
      />

      <button onClick={createBudget}>Create Budget</button>

      <hr />

      <h2>Budgets</h2>

      {budgets.length === 0 ? (
        <p>No budgets yet.</p>
      ) : (
        budgets.map((budget: any) => (
          <div key={budget.id}>
            #{budget.account_id} | {budget.category} | Limit ₹
            {budget.monthly_limit} | Spent ₹{budget.spent} | Remaining ₹
            {budget.remaining}
          </div>
        ))
      )}

      <hr />

      <h2>Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((tx: any) => (
          <div key={tx.id}>
            #{tx.id} | {tx.sender_id} → {tx.receiver_id} | {tx.category} | ₹{tx.amount} | {tx.status}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
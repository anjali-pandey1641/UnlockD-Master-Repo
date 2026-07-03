import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

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

  async function createAccount() {
    const response = await fetch("http://localhost:5000/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        balance: Number(balance),
      }),
    });

    if (response.ok) {
      setName("");
      setBalance("");
      fetchAccounts();
      fetchTransactions();
    } else {
      alert("Failed to create account");
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
      }),
    });

    if (response.ok) {
      setSender("");
      setReceiver("");
      setAmount("");

      fetchAccounts();
      fetchTransactions();
    } else {
      alert("Transfer failed");
    }
  }

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
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

      <button onClick={createAccount}>
        Create Account
      </button>

      <hr />

      <h2>Accounts</h2>

      {accounts.length === 0 ? (
        <p>No accounts yet.</p>
      ) : (
        accounts.map((account: any) => (
          <div key={account.id}>
            <strong>#{account.id} {account.name}</strong> — ₹{account.balance}
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

      <button onClick={transferMoney}>
        Transfer
      </button>

      <hr />

      <h2>Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((tx: any) => (
          <div key={tx.id}>
            #{tx.id} | {tx.sender_id} → {tx.receiver_id} | ₹{tx.amount} |{" "}
            {tx.status}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
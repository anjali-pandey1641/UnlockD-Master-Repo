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
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [budgetAccount, setBudgetAccount] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [memberAccount, setMemberAccount] = useState("");

  const [expenseGroup, setExpenseGroup] = useState("");
  const [payerId, setPayerId] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");

  const [custom1, setCustom1] = useState("");
  const [custom2, setCustom2] = useState("");
  const [custom3, setCustom3] = useState("");
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  async function fetchAccounts() {
    const response = await fetch("http://localhost:5000/accounts");
    const data = await response.json();
    setAccounts(data);
  }

  async function fetchTransactions() {
    const response = await fetch(
      `http://localhost:5000/transactions?search=${search}&category=${searchCategory}`,
    );
    const data = await response.json();
    setTransactions(data);
  }

  async function fetchBudgets() {
    const response = await fetch("http://localhost:5000/budgets");
    const data = await response.json();
    setBudgets(data);
  }
  async function fetchGroups() {
    const response = await fetch("http://localhost:5000/groups");
    const data = await response.json();
    setGroups(data);
  }

  async function fetchMembers(id: number) {
    const response = await fetch(`http://localhost:5000/groups/${id}/members`);
    const data = await response.json();
    setMembers(data);
  }

  async function fetchSettlements(id: number) {
    const response = await fetch(
      `http://localhost:5000/groups/${id}/settlements/db`,
    );
    const data = await response.json();
    setSettlements(data);
  }
  async function importStatement() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/transactions/import", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Imported!");
      fetchTransactions();
    } else {
      alert("Import failed");
    }
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
        description,
        merchant,
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
      setDescription("");
      setMerchant("");

      fetchAccounts();
      fetchTransactions();
      fetchBudgets();
    } else {
      alert("Transfer failed");
    }
  }
  async function createGroup() {
    const response = await fetch("http://localhost:5000/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: groupName,
      }),
    });

    if (response.ok) {
      setGroupName("");
      fetchGroups();
    } else {
      alert("Failed to create group");
    }
  }

  async function addMember() {
    const response = await fetch(
      `http://localhost:5000/groups/${groupId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: Number(memberAccount),
        }),
      },
    );

    if (response.ok) {
      setMemberAccount("");
      fetchMembers(Number(groupId));
    } else {
      alert("Failed to add member");
    }
  }

  async function createExpense() {
    const body: any = {
      payer_id: Number(payerId),
      description,
      amount: Number(expenseAmount),
      split_type: splitType,
    };

    if (splitType === "custom") {
      body.splits = [
        {
          account_id: 1,
          amount: Number(custom1),
        },
        {
          account_id: 2,
          amount: Number(custom2),
        },
        {
          account_id: 3,
          amount: Number(custom3),
        },
      ];
    }

    const response = await fetch(
      `http://localhost:5000/groups/${expenseGroup}/expenses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (response.ok) {
      alert("Expense Created");

      setExpenseGroup("");
      setPayerId("");
      setDescription("");
      setExpenseAmount("");
      setCustom1("");
      setCustom2("");
      setCustom3("");
    } else {
      alert("Failed");
    }
  }
  async function generateSettlements() {
    await fetch(`http://localhost:5000/groups/${groupId}/settlements`);
    fetchSettlements(Number(groupId));
  }

  async function markPaid(id: number) {
    await fetch(`http://localhost:5000/settlements/${id}/pay`, {
      method: "POST",
    });

    fetchSettlements(Number(groupId));
  }
  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
    fetchBudgets();
    fetchGroups();
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

      <h2>Create Group</h2>

      <input
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <button onClick={createGroup}>Create Group</button>

      <h2>Groups</h2>

      {groups.map((g: any) => (
        <div key={g.id}>
          <b>#{g.id}</b> {g.name}
        </div>
      ))}

      <hr />

      <h2>Add Member</h2>

      <input
        placeholder="Group ID"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />

      <input
        placeholder="Account ID"
        value={memberAccount}
        onChange={(e) => setMemberAccount(e.target.value)}
      />

      <button onClick={addMember}>Add Member</button>

      <button onClick={() => fetchMembers(Number(groupId))}>
        Load Members
      </button>

      {members.map((m: any) => (
        <div key={m.account_id}>👤 Account #{m.account_id}</div>
      ))}

      <hr />

      <h2>Create Expense</h2>

      <input
        placeholder="Group ID"
        value={expenseGroup}
        onChange={(e) => setExpenseGroup(e.target.value)}
      />

      <input
        placeholder="Payer ID"
        value={payerId}
        onChange={(e) => setPayerId(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        placeholder="Amount"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
      />

      <select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
        <option value="equal">Equal</option>
        <option value="custom">Custom</option>
      </select>

      {splitType === "custom" && (
        <>
          <input
            placeholder="Account 1 Amount"
            value={custom1}
            onChange={(e) => setCustom1(e.target.value)}
          />

          <input
            placeholder="Account 2 Amount"
            value={custom2}
            onChange={(e) => setCustom2(e.target.value)}
          />

          <input
            placeholder="Account 3 Amount"
            value={custom3}
            onChange={(e) => setCustom3(e.target.value)}
          />
        </>
      )}

      <button onClick={createExpense}>Create Expense</button>

      <hr />

      <h2>Settlements</h2>

      <button onClick={generateSettlements}>Generate Settlements</button>

      {settlements.map((s: any) => (
        <div key={s.id}>
          From Account #{s.from} → Account #{s.to}| ₹{s.amount}|{" "}
          {s.paid ? "✅ Paid" : "❌ Pending"}
          {!s.paid && <button onClick={() => markPaid(s.id)}>Mark Paid</button>}
        </div>
      ))}

      <hr />

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
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Merchant"
        value={merchant}
        onChange={(e) => setMerchant(e.target.value)}
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

      <input
        type="text"
        placeholder="Search description or merchant"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={() => window.open("http://localhost:5000/transactions/export")}
      >
        Export CSV
      </button>

      <button onClick={fetchTransactions}>Search</button>
      <input
        type="text"
        placeholder="Category Filter"
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
      />

      <h2>Transactions</h2>
      <hr />

      <h2>Transaction Import & Analytics</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button onClick={importStatement}>Import Statement</button>

      <button>Generate Analytics</button>

      <h3>Analytics Summary</h3>

      <p>Total Transactions: {transactions.length}</p>

      <p>
        Total Spending: ₹
        {transactions.reduce((sum, tx) => sum + Number(tx.amount), 0)}
      </p>

      <p>
        Food Transactions:{" "}
        {transactions.filter((tx) => tx.category === "Food").length}
      </p>

      <p>
        Most Used Category:{" "}
        {transactions.length === 0
          ? "N/A"
          : Object.entries(
              transactions.reduce((acc: any, tx: any) => {
                acc[tx.category] = (acc[tx.category] || 0) + 1;
                return acc;
              }, {}),
            ).sort((a: any, b: any) => b[1] - a[1])[0][0]}
      </p>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((tx: any) => (
          <div key={tx.id}>
            #{tx.id} |{tx.sender_id} → {tx.receiver_id} |{tx.category} |
            {tx.description} |{tx.merchant} | ₹{tx.amount} |{tx.status}
          </div>
        ))
      )}
    </div>
  );
}

export default App;

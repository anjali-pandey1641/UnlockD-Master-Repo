import "./App.css";

import Accounts from "./components/Accounts";
import Groups from "./components/Groups";
import Expenses from "./components/Expenses";
import Settlements from "./components/Settlements";
import Transfer from "./components/Transfer";
import Budgets from "./components/Budgets";
import Transactions from "./components/Transactions";
import Analytics from "./components/Analytics";

import { useAccounts } from "./hooks/useAccounts";
import { useBudgets } from "./hooks/useBudgets";
import { useGroups } from "./hooks/useGroups";
import { useTransactions } from "./hooks/useTransaction";
function App() {
  const accounts = useAccounts();
  const budgets = useBudgets();
  const groups = useGroups();
  const transactions = useTransactions();

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>💰 UnlockD Finance Manager</h1>
          <p>Manage accounts, budgets, transfers and group expenses</p>
        </div>
      </header>

      <Accounts {...accounts} />

      <Groups {...groups} accounts={accounts.accounts} />

      <Expenses
        {...groups}
        accounts={accounts.accounts}
        groups={groups.groups}
      />

      <Settlements
        settlements={groups.settlements}
        generateSettlements={groups.generateSettlements}
        markPaid={groups.markPaid}
      />

      <Transfer {...transactions} accounts={accounts.accounts} />

      <Budgets {...budgets} accounts={accounts.accounts} />
      <Transactions {...transactions} />

      <Analytics
        file={transactions.file}
        setFile={transactions.setFile}
        importStatement={transactions.importStatement}
      />
      <footer className="footer">UnlockD • Finance Manager • Sprint 1</footer>
    </div>
  );
}

export default App;

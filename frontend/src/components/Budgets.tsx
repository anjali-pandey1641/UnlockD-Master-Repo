type Props = {
  budgets: any[];

  budgetAccount: string;
  budgetCategory: string;
  budgetLimit: string;

  setBudgetAccount: (value: string) => void;
  setBudgetCategory: (value: string) => void;
  setBudgetLimit: (value: string) => void;

  createBudget: () => void;
};

export default function Budgets({
  budgets,
  budgetAccount,
  budgetCategory,
  budgetLimit,
  setBudgetAccount,
  setBudgetCategory,
  setBudgetLimit,
  createBudget,
}: Props) {
  return (
  <div className="card">
    <h2>Create Budget</h2>

    <div className="form-row">
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
    </div>

    <div className="button-row">
      <button onClick={createBudget}>
        Create Budget
      </button>
    </div>

    <h2 style={{ marginTop: "28px" }}>Budgets</h2>

    {budgets.length === 0 ? (
      <p>No budgets yet.</p>
    ) : (
      budgets.map((budget: any) => {
        const percent =
          budget.monthly_limit === 0
            ? 0
            : Math.min(
                (budget.spent / budget.monthly_limit) * 100,
                100,
              );

        return (
          <div
            key={budget.id}
            style={{ marginBottom: "20px" }}
          >
            <strong>
              #{budget.account_id} • {budget.category}
            </strong>

            <p>
              ₹{budget.spent} / ₹{budget.monthly_limit}
            </p>

            <div className="progress">
              <div
                className="progress-fill"
                style={{ width: `${percent}%` }}
              />
            </div>

            <small>
              Remaining ₹{budget.remaining}
            </small>
          </div>
        );
      })
    )}
  </div>
);
}
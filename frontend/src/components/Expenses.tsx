type Props = {
  expenseGroup: string;
  payerId: string;
  description: string;
  expenseAmount: string;
  splitType: string;

  custom1: string;
  custom2: string;
  custom3: string;

  setExpenseGroup: (value: string) => void;
  setPayerId: (value: string) => void;
  setDescription: (value: string) => void;
  setExpenseAmount: (value: string) => void;
  setSplitType: (value: string) => void;

  setCustom1: (value: string) => void;
  setCustom2: (value: string) => void;
  setCustom3: (value: string) => void;

  createExpense: () => void;
};

export default function Expenses({
  expenseGroup,
  payerId,
  description,
  expenseAmount,
  splitType,

  custom1,
  custom2,
  custom3,

  setExpenseGroup,
  setPayerId,
  setDescription,
  setExpenseAmount,
  setSplitType,

  setCustom1,
  setCustom2,
  setCustom3,

  createExpense,
}: Props) {
  return (
    <div className="card">
      <h2>Create Expense</h2>

      <div className="form-row">
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
      </div>

      <div className="form-row">
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
      </div>

      <div className="form-row">
        <select
          value={splitType}
          onChange={(e) => setSplitType(e.target.value)}
        >
          <option value="equal">Equal Split</option>
          <option value="custom">Custom Split</option>
        </select>
      </div>

      {splitType === "custom" && (
        <div className="form-row">
          <input
            placeholder="Account 1"
            value={custom1}
            onChange={(e) => setCustom1(e.target.value)}
          />

          <input
            placeholder="Account 2"
            value={custom2}
            onChange={(e) => setCustom2(e.target.value)}
          />

          <input
            placeholder="Account 3"
            value={custom3}
            onChange={(e) => setCustom3(e.target.value)}
          />
        </div>
      )}

      <div className="button-row">
        <button onClick={createExpense}>Create Expense</button>
      </div>
    </div>
  );
}

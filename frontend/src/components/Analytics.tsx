import { useAnalytics } from "../hooks/useAnalytics";

type Props = {
  file: File | null;
  setFile: (file: File | null) => void;
  importStatement: () => void;
};

export default function Analytics({ file, setFile, importStatement }: Props) {
  const analytics = useAnalytics();

  return (
    <div className="card">
      <h2>Analytics</h2>

      <div className="button-row">
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
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>{analytics.total_transactions}</h3>
          <p>Total Transactions</p>
        </div>

        <div className="stat-card">
          <h3>₹{analytics.total_spending}</h3>
          <p>Total Spending</p>
        </div>

        <div className="stat-card">
          <h3>{analytics.food_transactions}</h3>
          <p>Food Transactions</p>
        </div>

        <div className="stat-card">
          <h3>{analytics.most_used_category}</h3>
          <p>Most Used Category</p>
        </div>
      </div>
      <h2 style={{ marginTop: "30px" }}>Spending by Category</h2>

      {analytics.category_spending.map((item: any) => (
        <div key={item.category} style={{ marginBottom: "18px" }}>
          <strong>{item.category}</strong>
          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(item.amount / 20, 100)}%`,
              }}
            />
          </div>
          <small>₹{item.amount}</small>
        </div>
      ))}
    </div>
  );
}

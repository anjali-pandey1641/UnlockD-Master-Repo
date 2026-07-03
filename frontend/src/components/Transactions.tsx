type Props = {
  transactions: any[];

  search: string;
  searchCategory: string;

  setSearch: (value: string) => void;
  setSearchCategory: (value: string) => void;

  fetchTransactions: () => void;
};

export default function Transactions({
  transactions,
  search,
  searchCategory,
  setSearch,
  setSearchCategory,
  fetchTransactions,
}: Props) {
  return (
    <div className="card">
      <h2>Transactions</h2>

      <div className="form-row">
        <input
          type="text"
          placeholder="Search description or merchant"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category Filter"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        />
      </div>

      <div className="button-row">
        <button onClick={fetchTransactions}>Search</button>

        <button
          onClick={() =>
            window.open("http://localhost:5000/transactions/export")
          }
        >
          Export CSV
        </button>
      </div>

      <br />

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>From</th>
              <th>To</th>
              <th>Category</th>
              <th>Merchant</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx: any) => (
              <tr key={tx.id}>
                <td>{tx.sender_name}</td>
                <td>{tx.receiver_name}</td>
                <td>{tx.receiver_id}</td>
                <td>{tx.category || "-"}</td>
                <td>{tx.merchant || "-"}</td>
                <td>₹{tx.amount}</td>
                <td>
                  <span
                    className={
                      tx.status === "SUCCESS"
                        ? "status-success"
                        : tx.status === "PENDING"
                          ? "status-pending"
                          : "status-failed"
                    }
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

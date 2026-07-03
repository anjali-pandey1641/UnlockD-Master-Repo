type Props = {
  accounts: any[];
  name: string;
  balance: string;
  setName: (value: string) => void;
  setBalance: (value: string) => void;
  createAccount: () => void;
};

export default function Accounts({
  accounts,
  name,
  balance,
  setName,
  setBalance,
  createAccount,
}: Props) {
  return (
    <div className="card">
      <h2>Create Account</h2>

      <div className="form-row">
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
      </div>

      <div className="button-row">
        <button onClick={createAccount}>Create Account</button>
      </div>

      <h2 style={{ marginTop: "24px" }}>Accounts</h2>

      {accounts.length === 0 ? (
        <p>No accounts yet.</p>
      ) : (
        accounts.map((account: any) => (
          <div
            key={account.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <strong>
              #{account.id} {account.name}
            </strong>

            <span>₹{account.balance}</span>
          </div>
        ))
      )}
    </div>
  );
}

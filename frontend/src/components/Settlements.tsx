type Props = {
  settlements: any[];

  generateSettlements: () => void;
  markPaid: (id: number) => void;
};

export default function Settlements({
  settlements,
  generateSettlements,
  markPaid,
}: Props) {
  return (
    <div className="card">
      <h2>Settlements</h2>

      <div className="button-row">
        <button onClick={generateSettlements}>Generate Settlements</button>
      </div>

      {settlements.length === 0 ? (
        <p>No settlements generated.</p>
      ) : (
        settlements.map((s: any) => (
          <div key={s.id} className="settlement-item">
            <div>
              <strong>Account #{s.from}</strong>

              <span> → </span>

              <strong>Account #{s.to}</strong>

              <p>₹{s.amount}</p>
            </div>

            <div>
              <span
                className={s.paid ? "badge badge-paid" : "badge badge-pending"}
              >
                {s.paid ? "Paid" : "Pending"}
              </span>

              {!s.paid && (
                <button
                  style={{ marginLeft: "12px" }}
                  onClick={() => markPaid(s.id)}
                >
                  Mark Paid
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

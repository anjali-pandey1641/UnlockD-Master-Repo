type Props = {
  accounts: any[];

  sender: string;
  receiver: string;
  amount: string;
  category: string;
  description: string;
  merchant: string;

  setSender: (value: string) => void;
  setReceiver: (value: string) => void;
  setAmount: (value: string) => void;
  setCategory: (value: string) => void;
  setDescription: (value: string) => void;
  setMerchant: (value: string) => void;

  transferMoney: () => void;
};

export default function Transfer({
  accounts,
  sender,
  receiver,
  amount,
  category,
  description,
  merchant,
  setSender,
  setReceiver,
  setAmount,
  setCategory,
  setDescription,
  setMerchant,
  transferMoney,
}: Props) {
  return (
    <div className="card">
      <h2>Transfer Money</h2>

      <div className="form-row">
        <select value={sender} onChange={(e) => setSender(e.target.value)}>
          <option value="">Select Sender</option>

          {accounts.map((account: any) => (
            <option key={account.id} value={account.id}>
              {account.name} (#{account.id})
            </option>
          ))}
        </select>

        <select value={receiver} onChange={(e) => setReceiver(e.target.value)}>
          <option value="">Select Receiver</option>

          {accounts.map((account: any) => (
            <option key={account.id} value={account.id}>
              {account.name} (#{account.id})
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
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
      </div>

      <div className="form-row">
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
      </div>

      <div className="button-row">
        <button onClick={transferMoney}>Transfer Money</button>
      </div>
    </div>
  );
}

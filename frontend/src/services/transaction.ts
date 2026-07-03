const API = "http://localhost:5000";

export async function fetchTransactions(
  search: string,
  category: string,
) {
  const response = await fetch(
    `${API}/transactions?search=${search}&category=${category}`,
  );

  return await response.json();
}

export async function transferMoney(
  sender_id: number,
  receiver_id: number,
  amount: number,
  category: string,
  description: string,
  merchant: string,
) {
  return await fetch(`${API}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id,
      receiver_id,
      amount,
      category,
      description,
      merchant,
    }),
  });
}
const API = "http://localhost:5000";

export async function fetchAccounts() {
  const response = await fetch(`${API}/accounts`);
  return await response.json();
}

export async function createAccount(name: string, balance: number) {
  return await fetch(`${API}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      balance,
    }),
  });
}
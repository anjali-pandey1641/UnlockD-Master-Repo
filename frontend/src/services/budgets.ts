const API = "http://localhost:5000";

export async function fetchBudgets() {
  const response = await fetch(`${API}/budgets`);
  return await response.json();
}

export async function createBudget(
  account_id: number,
  category: string,
  monthly_limit: number,
) {
  return await fetch(`${API}/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id,
      category,
      monthly_limit,
    }),
  });
}
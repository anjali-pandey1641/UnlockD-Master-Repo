const API = "http://localhost:5000";

export async function fetchGroups() {
  const response = await fetch(`${API}/groups`);
  return await response.json();
}

export async function fetchMembers(id: number) {
  const response = await fetch(`${API}/groups/${id}/members`);
  return await response.json();
}

export async function fetchSettlements(id: number) {
  const response = await fetch(
    `${API}/groups/${id}/settlements/db`,
  );
  return await response.json();
}

export async function createGroup(name: string) {
  return await fetch(`${API}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
}

export async function addMember(
  groupId: number,
  accountId: number,
) {
  return await fetch(`${API}/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountId,
    }),
  });
}

export async function createExpense(
  groupId: number,
  body: any,
) {
  return await fetch(`${API}/groups/${groupId}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function generateSettlements(groupId: number) {
  return await fetch(
    `${API}/groups/${groupId}/settlements`,
  );
}

export async function markPaid(id: number) {
  return await fetch(
    `${API}/settlements/${id}/pay`,
    {
      method: "POST",
    },
  );
}
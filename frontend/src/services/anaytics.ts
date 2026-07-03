const API = "http://localhost:5000";

export async function importStatement(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return await fetch(`${API}/transactions/import`, {
    method: "POST",
    body: formData,
  });
}

export async function fetchAnalytics() {
  const response = await fetch(`${API}/analytics`);
  return await response.json();
}
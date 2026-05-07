const BASE_URL = "http://localhost:4000/api";

export async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "API request failed.");
  }

  return data;
}

export async function loginUser(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(credentials) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function fetchItems() {
  return request("/items");
}

export async function createItem(item) {
  return request("/items", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function updateItem(id, item) {
  return request(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

export async function deleteItem(id) {
  return request(`/items/${id}`, {
    method: "DELETE",
  });
}

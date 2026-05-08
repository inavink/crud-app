// Admin API functions
import { request } from "./api";

export async function fetchAllUsers() {
  return request("/admin/users");
}

export async function fetchAllItems() {
  return request("/admin/items");
}

export async function deleteUser(id) {
  return request(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

export async function deleteItem(id) {
  return request(`/admin/items/${id}`, {
    method: "DELETE",
  });
}

export async function updateUserRole(id, role) {
  return request(`/admin/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

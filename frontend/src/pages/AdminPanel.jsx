import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers, fetchAllItems, deleteUser, deleteItem, updateUserRole } from "../adminApi";

export default function AdminPanel({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    setError("");
    try {
      const [usersData, itemsData] = await Promise.all([fetchAllUsers(), fetchAllItems()]);
      setUsers(usersData);
      setItems(itemsData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteUser(id);
      setSuccess("User deleted successfully.");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteItem(id);
      setSuccess("Item deleted successfully.");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setError("");
    setSuccess("");
    try {
      await updateUserRole(id, newRole);
      setSuccess("User role updated successfully.");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage users and items</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          <button className="logout-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      {error && <p className="error-banner">{error}</p>}
      {success && <p className="success-banner">{success}</p>}

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button
          className={`tab-button ${activeTab === "items" ? "active" : ""}`}
          onClick={() => setActiveTab("items")}
        >
          Items ({items.length})
        </button>
      </div>

      {activeTab === "users" && (
        <section className="admin-section">
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="role-selector"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "items" && (
        <section className="admin-section">
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.username}</td>
                    <td className="description-cell">{item.description || "-"}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

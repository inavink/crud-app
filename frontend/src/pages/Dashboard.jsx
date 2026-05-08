import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchItems, createItem, updateItem, deleteItem } from "../api";

export default function Dashboard({ onLogout }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateItem(editingId, { title, description });
        setEditingId(null);
      } else {
        await createItem({ title, description });
      }
      setTitle("");
      setDescription("");
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteItem(id);
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <h1>My Items</h1>
          <p>Manage your items with create, update, and delete operations.</p>
        </div>
        <div className="header-actions">
          {userRole === "admin" && (
            <button className="admin-button" onClick={() => navigate("/admin")}>Admin Panel</button>
          )}
          <button className="logout-button" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <section className="item-form-card">
        <h2>{editingId ? "Edit Item" : "Create Item"}</h2>
        <form onSubmit={handleSave}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="button-row">
            <button type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => {
                setEditingId(null);
                setTitle("");
                setDescription("");
              }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="items-list">
        {items.length === 0 ? (
          <p>No items yet. Add one with the form above.</p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="item-card">
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <small>{new Date(item.created_at).toLocaleString()}</small>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button className="secondary" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

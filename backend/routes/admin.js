import express from "express";
import db from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();
router.use(requireAdmin);

// Get all users
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load users." });
  }
});

// Get all items
router.get("/items", async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT items.id, items.title, items.description, items.created_at, users.username, items.user_id
      FROM items
      JOIN users ON items.user_id = users.id
      ORDER BY items.created_at DESC
    `);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load items." });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (req.user.id === parseInt(id)) {
    return res.status(400).json({ message: "Cannot delete yourself." });
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

// Delete item
router.delete("/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM items WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.json({ message: "Item deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete item." });
  }
});

// Update user role
router.put("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  if (req.user.id === parseInt(id) && role === "user") {
    return res.status(400).json({ message: "Cannot remove admin role from yourself." });
  }

  try {
    const [result] = await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User role updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user role." });
  }
});

export default router;

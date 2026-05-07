import express from "express";
import db from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    const [items] = await db.query("SELECT id, title, description, created_at FROM items WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load items." });
  }
});

router.post("/", async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  try {
    const [result] = await db.query("INSERT INTO items (user_id, title, description) VALUES (?, ?, ?)", [req.user.id, title, description || ""]);
    res.status(201).json({ id: result.insertId, title, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create item." });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  try {
    const [result] = await db.query(
      "UPDATE items SET title = ?, description = ? WHERE id = ? AND user_id = ?",
      [title, description || "", id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.json({ id, title, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update item." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM items WHERE id = ? AND user_id = ?", [id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.json({ message: "Item deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete item." });
  }
});

export default router;

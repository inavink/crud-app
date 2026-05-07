import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const [rows] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const [rows] = await db.query("SELECT id, password FROM users WHERE username = ?", [username]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    return res.json({ token, username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed." });
  }
});

export default router;

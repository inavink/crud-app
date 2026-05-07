import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import authRoutes from "./routes/auth.js";
import itemsRoutes from "./routes/items.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

app.get("/", (req, res) => {
  res.send({ message: "CRUD API is running." });
});

async function initDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("Database tables ensured.");
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
});

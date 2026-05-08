import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing authentication token." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }

    req.user = user;
    next();
  });
}

import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// koneksi database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// cek koneksi
db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to database!");
});

// API menus
app.get("/api/menus", (req, res) => {

    //cek menu di DB
  db.query("SELECT * FROM menus", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// API Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // cek user di DB
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Server error" });
      if (results.length === 0) {
        return res.status(401).json({ error: "Username atau password salah!" });
      }

      // kalau ketemu
      res.json({ message: "Login berhasil", user: results[0] });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

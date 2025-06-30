const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const db = require("./config/db");
const todoRoutes = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.get("/db-check", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ dbConnection: true, result: rows[0].result });
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(500).json({ dbConnection: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send(" TODO App Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.get("/db-check", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ dbConnection: true, result: rows[0].result });
  } catch (err) {
    res.status(500).json({ dbConnection: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("TODO App Backend is running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

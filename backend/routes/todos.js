const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM todos ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title } = req.body;
  try {
    const [result] = await db.query("INSERT INTO todos (title, completed) VALUES (?, ?)", [title, false]);
    const [newTodo] = await db.query("SELECT * FROM todos WHERE id = ?", [result.insertId]);
    res.status(201).json(newTodo[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    await db.query("UPDATE todos SET title = ?, completed = ? WHERE id = ?", [title, completed, id]);
    const [updated] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM todos WHERE id = ?", [id]);
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
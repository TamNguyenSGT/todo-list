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
    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (completed !== undefined) {
      fields.push("completed = ?");
      values.push(completed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id); 
    const sql = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`;

    await db.query(sql, values);

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

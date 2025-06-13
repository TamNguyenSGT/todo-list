const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/tasks
router.get('/tasks', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// POST /api/tasks
router.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO todos (title, completed) VALUES (?, false)', [title], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, title, completed: false });
  });
  console.log('Received new task:', req.body);
});

// PUT /api/tasks/:id
router.put('/tasks/:id', (req, res) => {
  const { title, completed } = req.body;
  db.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.sendStatus(200);
  });
});


// DELETE /api/tasks/:id
router.delete('/tasks/:id', (req, res) => {
  db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.sendStatus(200);
  });
});

module.exports = router;

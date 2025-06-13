const express = require('express');
const router = express.Router();
const Todo = require('../models/todoModel');

router.get('/', (req, res) => {
  Todo.getAll((err, rows) => err ? res.sendStatus(500) : res.json(rows));
});

router.post('/', (req, res) => {
  const { title } = req.body;
  Todo.create(title, (err, result) => {
    if (err) return res.sendStatus(500);
    res.json({ id: result.insertId, title, completed: false });
  });
});

router.put('/:id', (req, res) => {
  const { title, completed } = req.body;
  Todo.update(req.params.id, title, completed, (err) =>
    err ? res.sendStatus(500) : res.sendStatus(200)
  );
});

router.delete('/:id', (req, res) => {
  Todo.delete(req.params.id, (err) =>
    err ? res.sendStatus(500) : res.sendStatus(204)
  );
});

module.exports = router;

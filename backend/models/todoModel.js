const db = require('../db');

exports.getAll = (cb) => {
  db.query('SELECT * FROM todos', cb);
};

exports.create = (title, cb) => {
  db.query('INSERT INTO todos (title) VALUES (?)', [title], cb);
};

exports.update = (id, title, completed, cb) => {
  db.query('UPDATE todos SET title=?, completed=? WHERE id=?', [title, completed, id], cb);
};

exports.delete = (id, cb) => {
  db.query('DELETE FROM todos WHERE id = ?', [id], cb);
};

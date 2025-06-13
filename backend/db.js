const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Thanhtam_0989601185',
  database: 'todo_app'
});
conn.connect();
module.exports = conn;

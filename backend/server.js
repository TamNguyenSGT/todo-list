const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

app.listen(3001, () => console.log('🚀 Server running on http://localhost:3001'));

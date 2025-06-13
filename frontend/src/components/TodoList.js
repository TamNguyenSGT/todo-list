import React, { useState, useEffect } from 'react';
import { getTodos, addTodo } from '../services/todoService';
import TodoItem from './TodoItem';
import Filter from './Filter';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [title, setTitle] = useState('');

  useEffect(() => {
    getTodos().then(setTodos);
  }, []);

  const handleAdd = async () => {
    if (!title) return;
    const newTodo = await addTodo(title);
    setTodos([...todos, newTodo]);
    setTitle('');
  };

  const filtered = todos.filter(todo => 
    filter === 'All' ? true :
    filter === 'Active' ? !todo.completed : todo.completed
  );

  return (
    <div>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={handleAdd}>Add</button>

      <Filter setFilter={setFilter} current={filter} />

      <ul>
        {filtered.map(todo => (
          <TodoItem key={todo.id} todo={todo} setTodos={setTodos} todos={todos} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;

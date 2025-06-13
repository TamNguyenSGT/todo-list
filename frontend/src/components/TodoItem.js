import React, { useState } from 'react';
import { updateTodo, deleteTodo } from '../services/todoService';

const TodoItem = ({ todo, setTodos, todos }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const toggleComplete = async () => {
    await updateTodo(todo.id, { title: todo.title, completed: !todo.completed });
    setTodos(todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id);
    setTodos(todos.filter(t => t.id !== todo.id));
  };

  const handleUpdate = async () => {
    await updateTodo(todo.id, { title, completed: todo.completed });
    setTodos(todos.map(t => t.id === todo.id ? { ...t, title } : t));
    setEditMode(false);
  };

  return (
    <li>
      <input type="checkbox" checked={todo.completed} onChange={toggleComplete} />
      {editMode ? (
        <>
          <input value={title} onChange={e => setTitle(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
};

export default TodoItem;

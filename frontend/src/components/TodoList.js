// src/components/TodoList.js

import React, { useEffect, useState } from "react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoApi";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error("Failed to load todos:", err);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const newTodo = await createTodo(newTitle);
      setTodos([newTodo, ...todos]);
      setNewTitle("");
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Enter new task"
      />
      <button onClick={handleCreate}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />
            {todo.title}
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

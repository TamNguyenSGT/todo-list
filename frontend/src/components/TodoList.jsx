import React, { useState, useEffect } from "react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoApi";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error("Failed to load todos:", error);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const todo = await createTodo(newTitle);
      setTodos([todo, ...todos]);
      setNewTitle("");
    } catch (error) {
      console.error("Create failed:", error);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const updated = await updateTodo(id, { completed: !currentStatus });
      setTodos(todos.map(t => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Todo List</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="New todo title"
        />
        <button onClick={handleCreate}>Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: "0.5rem" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id, todo.completed)}
            />
            <span style={{ marginLeft: "0.5rem", textDecoration: todo.completed ? "line-through" : "none" }}>
              {todo.title}
            </span>
            <button style={{ marginLeft: "1rem" }} onClick={() => handleDelete(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

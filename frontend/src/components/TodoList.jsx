import React, { useState, useEffect } from "react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoApi";
import { motion, AnimatePresence } from "framer-motion";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load todos:", error);
      alert("Failed to load todos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const todo = await createTodo(newTitle.trim());
      setTodos(prev => [todo, ...prev]);
      setNewTitle("");
    } catch (error) {
      console.error("Create failed:", error);
      alert("Failed to create todo: " + error.message);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const updated = await updateTodo(id, { completed: !currentStatus });
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update todo: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete todo: " + error.message);
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
        <button onClick={handleCreate} disabled={!newTitle.trim()}>
          Add
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <AnimatePresence>
            {todos.map(todo => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.2 }}
                style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                />
                <span
                  style={{
                    marginLeft: "0.5rem",
                    textDecoration: todo.completed ? "line-through" : "none",
                    flexGrow: 1,
                  }}
                >
                  {todo.title}
                </span>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

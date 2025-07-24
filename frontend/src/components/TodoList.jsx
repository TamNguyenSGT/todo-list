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
      setTodos((prev) => [todo, ...prev]);
      setNewTitle("");
    } catch (error) {
      console.error("Create failed:", error);
      alert("Failed to create todo: " + error.message);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const updated = await updateTodo(id, { completed: !currentStatus });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update todo: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete todo: " + error.message);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "2rem auto",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #f0f4ff, #e0ffe8)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Todo List</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New todo title"
          style={{
            flexGrow: 1,
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleCreate}
          disabled={!newTitle.trim()}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  backgroundColor: todo.completed ? "#d4edda" : "#f9f9f9",
                }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                }}
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    handleToggleComplete(todo.id, todo.completed)
                  }
                />
                <motion.span
                  style={{
                    marginLeft: "0.75rem",
                    flexGrow: 1,
                    fontSize: "1rem",
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "#888" : "#000",
                  }}
                  animate={{
                    opacity: todo.completed ? 0.6 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {todo.title}
                </motion.span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "0.4rem 0.7rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

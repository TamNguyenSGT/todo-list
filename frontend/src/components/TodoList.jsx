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
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleEdit = (id, title) => {
    setEditingId(id);
    setEditText(title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const updated = await updateTodo(id, { title: editText.trim() });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Edit save failed:", error);
      alert("Failed to save edit: " + error.message);
    }
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          style={{
            width: "50%",
            padding: "0.35rem 0.75rem",
            marginBottom: "0.6rem",
            borderRadius: "6px",
            border: "1px solid #bbb",
            fontSize: "0.9rem",
          }}
        />

        <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
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
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {["all", "active", "completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            disabled={filter === type}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: filter === type ? "#007bff" : "#fff",
              color: filter === type ? "#fff" : "#000",
              cursor: filter === type ? "default" : "pointer",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <AnimatePresence>
            {filteredTodos.map((todo) => (
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
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    handleToggleComplete(todo.id, todo.completed)
                  }
                />

                {editingId === todo.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={{
                        marginLeft: "0.75rem",
                        flexGrow: 1,
                        padding: "0.4rem",
                        borderRadius: "6px",
                        border: "1px solid #aaa",
                      }}
                    />
                    <button
                      onClick={() => handleSaveEdit(todo.id)}
                      style={{
                        marginLeft: "0.5rem",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        padding: "0.4rem 0.7rem",
                        borderRadius: "6px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        marginLeft: "0.3rem",
                        backgroundColor: "#6c757d",
                        color: "#fff",
                        border: "none",
                        padding: "0.4rem 0.7rem",
                        borderRadius: "6px",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <motion.span
                      style={{
                        marginLeft: "0.75rem",
                        flexGrow: 1,
                        fontSize: "1rem",
                        textDecoration: todo.completed
                          ? "line-through"
                          : "none",
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
                      onClick={() => handleEdit(todo.id, todo.title)}
                      style={{
                        marginRight: "0.5rem",
                        backgroundColor: "#ffc107",
                        color: "#000",
                        border: "none",
                        padding: "0.4rem 0.7rem",
                        borderRadius: "6px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        padding: "0.4rem 0.7rem",
                        borderRadius: "6px",
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

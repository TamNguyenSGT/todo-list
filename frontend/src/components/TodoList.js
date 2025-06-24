import { motion, AnimatePresence } from "framer-motion";
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
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

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

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditSave = async (id) => {
    try {
      const updated = await updateTodo(id, { title: editText, completed: false });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
      cancelEditing();
    } catch (err) {
      console.error("Failed to edit todo:", err);
    }
  };

  const filteredTodos = Array.isArray(todos)
  ? todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
  : [];


  return (
    <div>
      <h2>Todo List</h2>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Enter new task"
      />
      <button onClick={handleCreate}>Add</button>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>All</button>
        <button onClick={() => setFilter("active")} disabled={filter === "active"}>Active</button>
        <button onClick={() => setFilter("completed")} disabled={filter === "completed"}>Completed</button>
      </div>

      <ul>
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {editingId === todo.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleEditSave(todo.id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                  />
                  {todo.title}
                  <button onClick={() => startEditing(todo)}>Edit</button>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default TodoList;

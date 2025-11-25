import React, { useState, useEffect } from "react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoApi";
import { motion, AnimatePresence } from "framer-motion";
import "./TodoList.css";

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

  const handleNewTodoKey = (event) => {
    if (event.key === "Enter") {
      handleCreate();
    }
  };

  const handleEditKey = (event, id) => {
    if (event.key === "Enter") {
      handleSaveEdit(id);
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

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="todo-page">
      <section className="hero-card glass">
        <div className="hero-text">
          <p className="eyebrow">Hôm nay</p>
          <h1>Chạy việc rõ ràng, kết thúc gọn gàng</h1>
          <p className="lede">
            Nhập việc, lọc nhanh, đánh dấu xong ngay trên bảng. Không cần
            rườm rà hay mở thêm tab.
          </p>
          <div className="chip-row">
            <span className="chip">API connected</span>
            <span className="chip chip-outline">Inline edit</span>
            <span className="chip chip-warm">Tập trung</span>
          </div>
        </div>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Tổng việc</span>
            <strong className="stat-value">{todos.length}</strong>
            <small className="stat-sub">đang có</small>
          </div>
          <div className="stat-card">
            <span className="stat-label">Đang làm</span>
            <strong className="stat-value">{activeCount}</strong>
            <small className="stat-sub">chưa hoàn thành</small>
          </div>
          <div className="stat-card">
            <span className="stat-label">Hoàn tất</span>
            <strong className="stat-value">{completedCount}</strong>
            <small className="stat-sub">đã đánh dấu</small>
          </div>
        </div>
      </section>

      <section className="panel glass">
        <div className="control-grid">
          <label className="field">
            <span className="field-label">Tìm nhanh</span>
            <div className="input-shell">
              <span className="icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5 15.5L20 20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Lọc theo tiêu đề"
                className="input"
              />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Thêm công việc</span>
            <div className="input-shell">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleNewTodoKey}
                placeholder="Nhập việc cần làm"
                className="input"
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="btn primary"
              >
                Thêm
              </button>
            </div>
          </label>
        </div>

        <div className="filter-row">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              className={`pill ${filter === type ? "is-active" : ""}`}
              aria-pressed={filter === type}
            >
              {type === "all"
                ? "Tất cả"
                : type === "active"
                ? "Đang làm"
                : "Hoàn tất"}
            </button>
          ))}
        </div>
      </section>

      <section className="panel glass list-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Danh sách</p>
            <h3>Duy trì nhịp độ</h3>
          </div>
          <span className="badge">{filteredTodos.length} đang hiển thị</span>
        </div>

        {loading ? (
          <div className="empty">Đang tải danh sách...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty">
            <p>Không có việc phù hợp.</p>
            <span className="empty-sub">Thêm mới hoặc thay đổi bộ lọc.</span>
          </div>
        ) : (
          <ul className="todo-list">
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <motion.li
                  key={todo.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                  }}
                  className={`todo-item ${todo.completed ? "is-complete" : ""}`}
                >
                  <div className="item-main">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleComplete(todo.id, todo.completed)
                        }
                      />
                      <span className="checkbox-box" aria-hidden="true" />
                    </label>

                    {editingId === todo.id ? (
                      <input
                        className="edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => handleEditKey(e, todo.id)}
                        autoFocus
                      />
                    ) : (
                      <div className="item-text">
                        <span className="item-title">{todo.title}</span>
                        <span className="item-sub">
                          {todo.completed ? "Hoàn tất" : "Chưa hoàn thành"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="item-actions">
                    {editingId === todo.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(todo.id)}
                          className="btn success"
                        >
                          Lưu
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="btn ghost"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(todo.id, todo.title)}
                          className="btn ghost"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(todo.id)}
                          className="btn danger"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </div>
  );
}

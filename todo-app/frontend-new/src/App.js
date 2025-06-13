import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './components/TodoItem';

const BASE_URL = 'http://localhost:3002/api/todos';

const translations = {
  en: {
    title: '📝 TODO List',
    placeholder: 'Enter a new task',
    add: 'Add',
    all: 'All',
    active: 'Active',
    completed: 'Completed',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    errorLoad: '⚠️ Failed to load tasks',
    errorAdd: '⚠️ Failed to add task',
    errorUpdate: '⚠️ Failed to update task',
    errorDelete: '⚠️ Failed to delete task',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
  },
  vi: {
    title: '📝 Danh sách công việc',
    placeholder: 'Nhập công việc mới',
    add: 'Thêm',
    all: 'Tất cả',
    active: 'Chưa hoàn thành',
    completed: 'Đã hoàn thành',
    edit: 'Sửa',
    delete: 'Xóa',
    save: 'Lưu',
    cancel: 'Hủy',
    errorLoad: '⚠️ Không thể tải danh sách',
    errorAdd: '⚠️ Không thể thêm công việc',
    errorUpdate: '⚠️ Không thể cập nhật',
    errorDelete: '⚠️ Không thể xóa',
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    dark: 'Tối',
    light: 'Sáng',
  },
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const t = translations[language];

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
      setError(null);
    } catch {
      setError(t.errorLoad);
    }
  }, [t.errorLoad]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(`${BASE_URL}/tasks`, { title: newTask });
      setNewTask('');
      fetchTasks();
    } catch {
      setError(t.errorAdd);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`);
      fetchTasks();
    } catch {
      setError(t.errorDelete);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${BASE_URL}/tasks/${task.id}`, {
        title: task.title,
        completed: !task.completed,
      });
      fetchTasks();
    } catch {
      setError(t.errorUpdate);
    }
  };

  const saveEdit = async (task) => {
    if (!editingText.trim()) return;
    try {
      await axios.put(`${BASE_URL}/tasks/${task.id}`, {
        title: editingText,
        completed: task.completed,
      });
      setEditingTaskId(null);
      setEditingText('');
      setSaveSuccess(true);
      fetchTasks();
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setError(t.errorUpdate);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <motion.div style={{ ...styles.container, ...theme.container }}>
      <div style={styles.header}>
        <h1>{t.title}</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.select}>
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
          <select value={darkMode ? 'dark' : 'light'} onChange={(e) => setDarkMode(e.target.value === 'dark')} style={styles.select}>
            <option value="light">{t.light}</option>
            <option value="dark">{t.dark}</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{ color: 'green', marginBottom: 10, fontWeight: 'bold' }}
          >
            ✅ {t.save}!
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={styles.inputGroup}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={t.placeholder}
          style={{ ...styles.input, ...theme.input }}
        />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addTask} style={theme.addButton}>
          {t.add}
        </motion.button>
      </div>

      <div style={styles.filterGroup}>
        {['all', 'active', 'completed'].map((f) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterButton,
              backgroundColor: filter === f ? theme.activeFilter : theme.buttonBg,
              color: theme.buttonColor,
            }}
          >
            {t[f]}
          </motion.button>
        ))}
      </div>

      <ul style={styles.taskList}>
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              editingTaskId={editingTaskId}
              editingText={editingText}
              setEditingTaskId={setEditingTaskId}
              setEditingText={setEditingText}
              onSaveEdit={saveEdit}
              onDelete={deleteTask}
              onToggle={toggleComplete}
              theme={theme}
              t={t}
            />
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 700,
    margin: 'auto',
    borderRadius: 12,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  select: {
    padding: '6px 12px',
    borderRadius: 6,
  },
  inputGroup: {
    marginBottom: 20,
    display: 'flex',
  },
  input: {
    padding: 10,
    flexGrow: 1,
    marginRight: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterButton: {
    marginRight: 10,
    padding: '6px 12px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  taskList: {
    paddingLeft: 0,
    listStyle: 'none',
  },
};

const lightTheme = {
  container: { backgroundColor: '#fff', color: '#000', boxShadow: '0 0 15px rgba(0,0,0,0.1)' },
  input: { backgroundColor: '#fff', color: '#000' },
  addButton: { backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 16px', cursor: 'pointer' },
  editButton: { backgroundColor: '#ffc107', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' },
  deleteButton: { backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' },
  saveButton: { backgroundColor: '#4caf50', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' },
  cancelButton: { backgroundColor: '#9e9e9e', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' },
  buttonBg: '#2196f3',
  buttonColor: '#fff',
  activeFilter: '#1976d2',
  taskItem: { backgroundColor: '#f7f7f7', padding: 10, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 },
  text: '#000',
};

const darkTheme = {
  container: { backgroundColor: '#121212', color: '#fff', boxShadow: '0 0 20px rgba(255,255,255,0.1)' },
  input: { backgroundColor: '#1e1e1e', color: '#fff', border: '1px solid #444' },
  addButton: { backgroundColor: '#66bb6a', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 16px', cursor: 'pointer' },
  editButton: { backgroundColor: '#ffb300', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', color: '#000' },
  deleteButton: { backgroundColor: '#e53935', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' },
  saveButton: { backgroundColor: '#43a047', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' },
  cancelButton: { backgroundColor: '#757575', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' },
  buttonBg: '#424242',
  buttonColor: '#fff',
  activeFilter: '#64b5f6',
  taskItem: { backgroundColor: '#1e1e1e', padding: 10, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 },
  text: '#fff',
};

export default App;

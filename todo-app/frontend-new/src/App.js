import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './components/TodoItem';

const BASE_URL = 'http://localhost:3002/api/todos';

const t = {
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
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks`);
      setTasks(res.data);
      setError(null);
    } catch {
      setError(t.errorLoad);
    }
  }, []);

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

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <motion.div style={styles.container}>
      <div style={styles.header}>
        <h1>{t.title}</h1>
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
          style={styles.input}
        />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addTask} style={styles.addButton}>
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
              backgroundColor: filter === f ? '#1976d2' : '#2196f3',
              color: '#fff',
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
              isEditing={editingTaskId === task.id}
              editingText={editingText}
              onChangeEditText={setEditingText}
              onStartEdit={startEdit}
              onSave={saveEdit}
              onCancel={cancelEdit}
              onDelete={deleteTask}
              onToggle={toggleComplete}
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
    backgroundColor: '#282c34',
    color: 'white',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 700,
    margin: 'auto',
    borderRadius: 12,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
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
  addButton: {
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '10px 16px',
    cursor: 'pointer',
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

export default App;

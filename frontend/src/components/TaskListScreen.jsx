import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// issue_09-UI-Animation: Add animations for task list transitions
const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setErrorMessage('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      await axios.post('http://localhost:3002/api/tasks', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
      setErrorMessage('Failed to add task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      setErrorMessage('Failed to delete task');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Task List with Animation</h1>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex gap-2"
      >
        <input
          type="text"
          placeholder="New task title..."
          className="p-2 border border-gray-300 rounded w-full"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddTask}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add
        </motion.button>
      </motion.div>

      {/* Task List with animation */}
      <AnimatePresence>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow p-4 rounded flex justify-between items-center"
            >
              <span>{task.title}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
};

export default TaskListScreen;

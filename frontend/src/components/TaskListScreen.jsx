import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      await axios.post('http://localhost:3002/api/tasks', {
        title: newTaskTitle,
      });
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      await axios.put(`http://localhost:3002/api/tasks/${task.id}`, {
        ...task,
        status: task.status === 'completed' ? 'active' : 'completed',
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const handleSaveEdit = async (task) => {
    if (!editingTitle.trim()) return;
    try {
      await axios.put(`http://localhost:3002/api/tasks/${task.id}`, {
        ...task,
        title: editingTitle,
      });
      setEditingId(null);
      setEditingTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  };

  // Filtered result
  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title.toLowerCase().includes(filterTitle.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || task.status === filterStatus;
    return matchesTitle && matchesStatus;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Task List</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New task title..."
          className="p-2 border border-gray-300 rounded w-full"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Task
        </button>
      </div>

      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Filter by title..."
          className="p-2 border border-gray-300 rounded w-full"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Completed</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id} className="text-center">
              <td className="border border-gray-300 p-2">{task.id}</td>
              <td className="border border-gray-300 p-2">
                {editingId === task.id ? (
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  task.title
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleToggleStatus(task)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                {editingId === task.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(task)}
                      className="text-green-600 hover:underline mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListScreen;

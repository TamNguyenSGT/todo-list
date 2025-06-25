import React from 'react';

const TaskListScreen = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Task List</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by title..."
          className="p-2 border border-gray-300 rounded w-full"
          disabled
        />
        <select
          className="p-2 border border-gray-300 rounded"
          disabled
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border border-gray-300 p-2">1</td>
            <td className="border border-gray-300 p-2">Sample Task</td>
            <td className="border border-gray-300 p-2">Active</td>
            <td className="border border-gray-300 p-2">
              <button className="text-blue-600 hover:underline mr-2">Edit</button>
              <button className="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="New task title..."
          className="p-2 border border-gray-300 rounded w-full"
          disabled
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled
        >
          + Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskListScreen;

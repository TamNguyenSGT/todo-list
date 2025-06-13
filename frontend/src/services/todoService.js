import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/todos';

export const fetchTasks = () => axios.get(`${BASE_URL}/tasks`);
export const addTask = (title) => axios.post(`${BASE_URL}/tasks`, { title });
export const deleteTask = (id) => axios.delete(`${BASE_URL}/tasks/${id}`);
export const updateTask = (id, task) => axios.put(`${BASE_URL}/tasks/${id}`, task);

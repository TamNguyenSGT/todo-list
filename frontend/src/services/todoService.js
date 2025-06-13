const API = 'http://localhost:3001/api/todos';

export const getTodos = async () => (await fetch(API)).json();

export const addTodo = async (title) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title })
  });
  return res.json();
};

export const updateTodo = async (id, data) => {
  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
};

export const deleteTodo = async (id) => {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
};

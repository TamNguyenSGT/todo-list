const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8081/api/todos";

export const fetchTodos = async () => {
  const res = await fetch(API_BASE);
  return await res.json();
};

export const createTodo = async (title) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return await res.json();
};

export const updateTodo = async (id, data) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteTodo = async (id) => {
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
};

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchTodos() {
  try {
    const response = await fetch(`${API_URL}/api/todos`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch todos: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

export async function createTodo(title) {
  try {
    const response = await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create todo: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
}

export async function updateTodo(id, updatedTodo) {
  try {
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update todo: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

export async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete todo: ${errorText}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}

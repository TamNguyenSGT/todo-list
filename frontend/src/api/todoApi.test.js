import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./todoApi";

global.fetch = jest.fn(); 

afterEach(() => {
  jest.clearAllMocks(); 
});

describe("todoApi", () => {
  test("fetchTodos should return data", async () => {
    const mockData = [{ id: 1, title: "Test", completed: false }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchTodos();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("/api/todos");
  });

  test("createTodo should send POST and return new todo", async () => {
    const title = "New Task";
    const mockResponse = { id: 2, title, completed: false };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await createTodo(title);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith("/api/todos", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }));
  });

  test("updateTodo should send PUT and return updated todo", async () => {
    const id = 1;
    const payload = { title: "Updated", completed: true };
    const mockResponse = { id, ...payload };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await updateTodo(id, payload);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`/api/todos/${id}`, expect.objectContaining({
      method: "PUT",
      body: JSON.stringify(payload),
    }));
  });

  test("deleteTodo should send DELETE and return message", async () => {
    const id = 1;
    const mockResponse = { message: "Todo deleted successfully" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await deleteTodo(id);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`/api/todos/${id}`, { method: "DELETE" });
  });

  test("fetchTodos should throw on error", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchTodos()).rejects.toThrow("Failed to fetch todos");
  });
});
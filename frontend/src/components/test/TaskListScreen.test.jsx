import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import TaskListScreen from '../TaskListScreen';

jest.mock('axios');

describe('TaskListScreen', () => {
  const mockTasks = [
    { id: 1, title: 'Test Task 1', status: 'active' },
    { id: 2, title: 'Test Task 2', status: 'completed' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockTasks });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays tasks on load', async () => {
    render(<TaskListScreen />);

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3002/api/tasks');

    const task1 = await screen.findByText('Test Task 1');
    const task2 = await screen.findByText('Test Task 2');

    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();
  });

  test('adds a task', async () => {
    axios.post.mockResolvedValue({});
    render(<TaskListScreen />);

    const input = screen.getByPlaceholderText('New task title...');
    fireEvent.change(input, { target: { value: 'New Task' } });

    const addButton = screen.getByText('+ Add Task');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3002/api/tasks', { title: 'New Task' });
    });
  });

  test('deletes a task', async () => {
    axios.delete.mockResolvedValue({});
    render(<TaskListScreen />);

    const deleteButtons = await screen.findAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:3002/api/tasks/1');
    });
  });
});

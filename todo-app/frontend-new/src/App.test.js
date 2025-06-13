import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock Axios
jest.mock('axios');

describe('App component', () => {
  const mockTasks = [
    { id: 1, title: 'Test Task 1', completed: false },
    { id: 2, title: 'Test Task 2', completed: true },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockTasks });
  });

  it('renders the title', async () => {
    render(<App />);
    expect(await screen.findByText('📝 TODO List')).toBeInTheDocument();
  });

  it('renders loaded tasks', async () => {
    render(<App />);
    expect(await screen.findByText('Test Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Test Task 2')).toBeInTheDocument();
  });

  it('can add a new task', async () => {
    axios.post.mockResolvedValue({}); // mock add
    axios.get.mockResolvedValueOnce({ data: [...mockTasks, { id: 3, title: 'New Task', completed: false }] });

    render(<App />);
    const input = screen.getByPlaceholderText('Enter a new task');
    fireEvent.change(input, { target: { value: 'New Task' } });

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  it('filters tasks', async () => {
    render(<App />);
    const activeButton = await screen.findByText('Active');
    fireEvent.click(activeButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
  });
});

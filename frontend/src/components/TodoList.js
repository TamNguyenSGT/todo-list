import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';

function TodoList({ tasks, ...props }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
      <AnimatePresence>
        {tasks.map((task) => (
          <TodoItem key={task.id} task={task} {...props} />
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default TodoList;

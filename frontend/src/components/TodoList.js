// TodoList.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TodoList({ tasks, editingTaskId, editingText, onToggle, onStartEdit, onDelete, onEditChange, onSaveEdit, onCancelEdit, theme, t }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ ...theme.taskItem, margin: '10px 0', display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 6 }}
          >
            <input type="checkbox" checked={task.completed} onChange={() => onToggle(task)} />
            {editingTaskId === task.id ? (
              <>
                <input value={editingText} onChange={(e) => onEditChange(e.target.value)} style={{ flexGrow: 1, padding: '6px', border: '1px solid #ccc', borderRadius: 6 }} />
                <button onClick={() => onSaveEdit(task)} style={theme.saveButton}>{t.save}</button>
                <button onClick={onCancelEdit} style={theme.cancelButton}>{t.cancel}</button>
              </>
            ) : (
              <>
                <span style={{ flexGrow: 1, textDecoration: task.completed ? 'line-through' : 'none', color: theme.text }}>{task.title}</span>
                <button onClick={() => onStartEdit(task)} style={theme.editButton}>{t.edit}</button>
                <button onClick={() => onDelete(task.id)} style={theme.deleteButton}>{t.delete}</button>
              </>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default TodoList;

import React from 'react';
import { motion } from 'framer-motion';

function TodoItem({
  task,
  isEditing,
  editingText,
  onChangeEditText,
  onSave,
  onCancel,
  onStartEdit,
  onDelete,
  onToggle,
  theme,
  t,
}) {
  return (
    <motion.li
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{ ...styles.taskItem, ...theme.taskItem }}
    >
      <input type="checkbox" checked={task.completed} onChange={() => onToggle(task)} />
      {isEditing ? (
        <>
          <input
            value={editingText}
            onChange={(e) => onChangeEditText(e.target.value)}
            style={{ ...styles.editInput, ...theme.input }}
          />
          <button onClick={() => onSave(task)} style={theme.saveButton}>{t.save}</button>
          <button onClick={onCancel} style={theme.cancelButton}>{t.cancel}</button>
        </>
      ) : (
        <>
          <span
            style={{
              ...styles.taskText,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: theme.text,
            }}
          >
            {task.title}
          </span>
          <button onClick={() => onStartEdit(task)} style={theme.editButton}>{t.edit}</button>
          <button onClick={() => onDelete(task.id)} style={theme.deleteButton}>{t.delete}</button>
        </>
      )}
    </motion.li>
  );
}

const styles = {
  taskItem: {
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 6,
  },
  taskText: {
    flexGrow: 1,
  },
  editInput: {
    flexGrow: 1,
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: 6,
  },
};

export default TodoItem;

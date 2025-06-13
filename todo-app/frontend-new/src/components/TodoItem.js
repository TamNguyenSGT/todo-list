import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function TodoItem({
  task,
  isEditing,
  editingText,
  onChangeEditText,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
  onToggle,
  t,
}) {
  return (
    <motion.li
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={styles.taskItem}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
      />

      {isEditing ? (
        <>
          <input
            value={editingText}
            onChange={(e) => onChangeEditText(e.target.value)}
            style={styles.editInput}
          />
          <button onClick={() => onSave(task)} style={styles.saveButton}>
            {t.save}
          </button>
          <button onClick={onCancel} style={styles.cancelButton}>
            {t.cancel}
          </button>
        </>
      ) : (
        <>
          <span
            style={{
              ...styles.taskText,
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </span>
          <button onClick={() => onStartEdit(task)} style={styles.editButton}>
            {t.edit}
          </button>
          <button onClick={() => onDelete(task.id)} style={styles.deleteButton}>
            {t.delete}
          </button>
        </>
      )}
    </motion.li>
  );
}

TodoItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  editingText: PropTypes.string.isRequired,
  onChangeEditText: PropTypes.func.isRequired,
  onStartEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  t: PropTypes.object.isRequired,
};

const styles = {
  taskItem: {
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f7f7f7',
  },
  taskText: {
    flexGrow: 1,
    color: '#000',
  },
  editInput: {
    flexGrow: 1,
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#ffc107',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  },
};

export default TodoItem;

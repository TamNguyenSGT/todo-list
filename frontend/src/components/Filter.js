// Filter.js
import React from 'react';
import { motion } from 'framer-motion';

function Filter({ filter, setFilter, theme, t }) {
  const filters = ['all', 'active', 'completed'];
  return (
    <div style={{ marginBottom: 20 }}>
      {filters.map((f) => (
        <motion.button
          key={f}
          whileHover={{ scale: 1.05 }}
          onClick={() => setFilter(f)}
          style={{
            marginRight: 10,
            padding: '6px 12px',
            border: 'none',
            borderRadius: 6,
            backgroundColor: filter === f ? theme.activeFilter : theme.buttonBg,
            color: theme.buttonColor,
            cursor: 'pointer',
          }}
        >
          {t[f]}
        </motion.button>
      ))}
    </div>
  );
}

export default Filter;

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggle } = useTheme();
  return (
    <button className="theme-toggle-btn" onClick={toggle} title="Toggle theme">
      {mode === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle; 
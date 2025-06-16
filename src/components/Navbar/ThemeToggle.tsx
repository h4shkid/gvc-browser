import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggle } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`} placement="bottom">
      <IconButton
        onClick={toggle}
        sx={{
          color: 'var(--text-primary, #fff)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-color, #404040)',
          borderRadius: 2,
          padding: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(102, 179, 255, 0.1)',
            borderColor: '#66b3ff',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          }
        }}
        size="small"
      >
        {mode === 'light' ? (
          <DarkMode 
            fontSize="small" 
            sx={{ 
              transition: 'all 0.3s ease',
              filter: 'drop-shadow(0 0 4px rgba(102, 179, 255, 0.3))'
            }} 
          />
        ) : (
          <LightMode 
            fontSize="small" 
            sx={{ 
              transition: 'all 0.3s ease',
              filter: 'drop-shadow(0 0 4px rgba(255, 193, 7, 0.3))',
              color: '#ffc107'
            }} 
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 
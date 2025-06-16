import React, { createContext, useEffect, useState, useContext } from 'react';

interface ThemeContextValue {
  mode: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('gvc-theme');
    return (saved as 'light' | 'dark') || 'dark'; // Default to dark mode
  });

  useEffect(() => {
    // Apply theme classes to body and update CSS variables
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);
    
    // Update CSS custom properties for comprehensive theming
    const root = document.documentElement;
    
    if (mode === 'light') {
      // Light theme - warm, clean colors (not pure white)
      root.style.setProperty('--bg', '#f8f9fa');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--surface-alt', '#f1f3f4');
      root.style.setProperty('--text-primary', '#2c3e50');
      root.style.setProperty('--text-secondary', '#6c757d');
      root.style.setProperty('--border-color', '#dee2e6');
      root.style.setProperty('--trait-bg', '#f8f9fa');
      root.style.setProperty('--link-color', '#0066cc');
      root.style.setProperty('--link-hover-color', '#004499');
      root.style.setProperty('--shadow', '0 2px 8px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--primary', '#667eea');
    } else {
      // Dark theme - current styling
      root.style.setProperty('--bg', '#000000');
      root.style.setProperty('--card-bg', '#2a2a2a');
      root.style.setProperty('--surface-alt', '#1f2133');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a0a0a0');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--trait-bg', '#333333');
      root.style.setProperty('--link-color', '#66b3ff');
      root.style.setProperty('--link-hover-color', '#99ccff');
      root.style.setProperty('--shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--primary', '#667eea');
    }
    
    localStorage.setItem('gvc-theme', mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be within ThemeProvider');
  return ctx;
}; 
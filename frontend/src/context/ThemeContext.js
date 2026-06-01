import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const PRESETS = {
  Green: '#00AB55',
  Purple: '#7635dc',
  Blue: '#2065D1',
  Navy: '#0C53B7',
  Orange: '#B72136',
  Red: '#e63946'
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('kps_theme_mode');
    return saved ? saved === 'dark' : false;
  });

  const [preset, setPreset] = useState(() => {
    const saved = localStorage.getItem('kps_theme_preset');
    return saved && PRESETS[saved] ? saved : 'Green';
  });

  useEffect(() => {
    localStorage.setItem('kps_theme_mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('kps_theme_preset', preset);
  }, [preset]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const changePreset = (name) => {
    if (PRESETS[name]) {
      setPreset(name);
    }
  };

  const primary = PRESETS[preset];

  // Theme values
  const theme = {
    primary,
    preset,
    isDark,
    background: isDark ? '#161c24' : '#f4f6f8',
    card: isDark ? '#212b36' : '#ffffff',
    text: isDark ? '#ffffff' : '#212b36',
    muted: '#919eab',
    border: isDark ? '#2d3748' : '#e9ecef',
    error: '#ff4842',
    success: '#00AB55',
    presets: PRESETS
  };

  return (
    <ThemeContext.Provider value={{ isDark, preset, toggleTheme, changePreset, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

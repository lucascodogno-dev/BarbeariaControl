import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { getCurrentTheme, toggleTheme } from '../../utils/theme';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Configura o estado inicial com base no tema atual
  useEffect(() => {
    setIsDarkMode(getCurrentTheme() === 'dark');
  }, []);
  
  // Manipula o clique no botão de alternar tema
  const handleToggle = () => {
    const newTheme = toggleTheme();
    setIsDarkMode(newTheme === 'dark');
  };
  
  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
      aria-label={isDarkMode ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
      title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
    >
      {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
};

export default ThemeToggle;
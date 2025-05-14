/**
 * Theme utility functions for toggling between light and dark mode
 * This handles persisting theme preferences in localStorage and applying
 * the appropriate theme classes to the HTML element.
 */

// Theme constants
const THEME_STORAGE_KEY = 'barbershop-theme-preference';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

/**
 * Initialize theme based on user preference or system preference
 * This should be called when the application starts
 */
export const initializeTheme = () => {
  // Check for saved theme preference or use system preference
  let theme = getSavedTheme();
  
  // If no saved preference, check system preference
  if (!theme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? DARK_THEME : LIGHT_THEME;
  }
  
  // Apply the theme
  applyTheme(theme);
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getSavedTheme()) {
      applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
    }
  });
};

/**
 * Toggle between light and dark themes
 * @returns {string} The new theme after toggling
 */
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  
  applyTheme(newTheme);
  saveTheme(newTheme);
  
  return newTheme;
};

/**
 * Get the current theme
 * @returns {string} 'dark' or 'light'
 */
export const getCurrentTheme = () => {
  return document.documentElement.classList.contains(DARK_THEME) 
    ? DARK_THEME 
    : LIGHT_THEME;
};

/**
 * Apply the specified theme by adding/removing the 'dark' class from html element
 * @param {string} theme 'dark' or 'light'
 */
export const applyTheme = (theme) => {
  if (theme === DARK_THEME) {
    document.documentElement.classList.add(DARK_THEME);
  } else {
    document.documentElement.classList.remove(DARK_THEME);
  }
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content', 
      theme === DARK_THEME ? '#0f172a' : '#f9fafb'
    );
  }
};

/**
 * Save theme preference to localStorage
 * @param {string} theme 'dark' or 'light'
 */
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference to localStorage:', error);
  }
};

/**
 * Get saved theme from localStorage
 * @returns {string|null} 'dark', 'light', or null if not set
 */
export const getSavedTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to get theme preference from localStorage:', error);
    return null;
  }
};

/**
 * Check if system prefers dark mode
 * @returns {boolean} true if system prefers dark mode
 */
export const systemPrefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export default {
  toggleTheme,
  getCurrentTheme,
  initializeTheme,
  systemPrefersDarkMode,
};
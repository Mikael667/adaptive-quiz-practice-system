export const readTheme = () => {
  try {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const setGlobalTheme = (theme) => {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', nextTheme);
  try {
    localStorage.setItem('theme', nextTheme);
  } catch {
    // Keep the current page theme even when browser storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent('app-theme-change', { detail: nextTheme }));
};

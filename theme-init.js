(() => {
  'use strict';

  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;

  root.classList.add('js');
  try { savedTheme = localStorage.getItem('aref-theme'); } catch (error) { /* Storage is optional. */ }

  const theme = savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : systemTheme.matches ? 'dark' : 'light';

  root.dataset.theme = theme;
  root.dataset.themeSource = savedTheme ? 'manual' : 'system';

  const color = document.querySelector('[data-theme-color]');
  if (color) color.content = color.dataset[theme];
})();

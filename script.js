(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  const scrollTopButton = document.querySelector('.scroll-top');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeColor = document.querySelector('[data-theme-color]');

  root.classList.add('js');

  const syncThemeControl = () => {
    const isDark = root.dataset.theme === 'dark';
    themeToggle?.setAttribute('aria-pressed', String(isDark));
    themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeColor) themeColor.content = themeColor.dataset[isDark ? 'dark' : 'light'];
  };

  const setTheme = (theme, persist = true) => {
    root.dataset.theme = theme;
    root.dataset.themeSource = persist ? 'manual' : 'system';
    if (persist) {
      try { localStorage.setItem('aref-theme', theme); } catch (error) { /* Storage is optional. */ }
    }
    syncThemeControl();
  };

  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  systemTheme.addEventListener?.('change', (event) => {
    if (root.dataset.themeSource === 'system') setTheme(event.matches ? 'dark' : 'light', false);
  });
  syncThemeControl();

  const setMenu = (open) => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.dataset.open = String(open);
  };

  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation?.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation?.dataset.open === 'true') {
      setMenu(false);
      menuButton?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (navigation?.dataset.open === 'true' && !header?.contains(event.target)) setMenu(false);
  });

  const syncScrollUI = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    scrollTopButton?.classList.toggle('is-visible', window.scrollY > 700);
  };
  syncScrollUI();
  window.addEventListener('scroll', syncScrollUI, { passive: true });
  scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));

  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const sectionTargets = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    sectionTargets.forEach((section) => sectionObserver.observe(section));
  }

  root.dataset.enhanced = 'true';
})();

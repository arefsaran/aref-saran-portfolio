(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('#primary-nav');
  const desktopNavigation = window.matchMedia('(min-width: 861px)');

  root.classList.add('js');

  const setMenu = (open, returnFocus = false) => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.dataset.open = String(open);
    if (returnFocus) menuButton.focus();
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation?.dataset.open === 'true') setMenu(false, true);
  });

  document.addEventListener('click', (event) => {
    if (navigation?.dataset.open === 'true' && !header?.contains(event.target)) setMenu(false);
  });

  desktopNavigation.addEventListener?.('change', (event) => {
    if (event.matches) setMenu(false);
  });

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const sectionTargets = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-24% 0px -68% 0px', threshold: 0 });
    sectionTargets.forEach((section) => sectionObserver.observe(section));
  }

  root.dataset.enhanced = 'true';
})();

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

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if (reducedMotion.matches || !('IntersectionObserver' in window)) revealItems.forEach((item) => item.classList.add('is-visible'));
  else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .13, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

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

  const runButton = document.querySelector('#run-suite');
  const labConsole = document.querySelector('.lab-console');
  const suiteState = document.querySelector('[data-testid="suite-state"]');
  const progressTrack = document.querySelector('.progress-track');
  const progressValue = document.querySelector('.progress-value');
  const resultSummary = document.querySelector('[data-testid="result-summary"]');
  const resultTime = document.querySelector('.result-time');
  const stages = [...document.querySelectorAll('.pipeline li')];
  let runToken = 0;

  const updateProgress = (value) => {
    progressTrack.dataset.progress = String(value);
    progressTrack.setAttribute('aria-valuenow', String(value));
    progressTrack.querySelector('.progress-fill').style.width = `${value}%`;
    progressValue.textContent = `${value}%`;
  };

  const resetSuite = () => {
    stages.forEach((stage) => {
      stage.dataset.state = 'pending';
      stage.querySelector(':scope > b').textContent = 'Waiting';
    });
    updateProgress(0);
    labConsole.dataset.runState = 'running';
    suiteState.textContent = 'Running';
    resultSummary.textContent = 'Checks in progress';
    resultTime.textContent = '00:00';
  };

  const completeSuite = () => {
    labConsole.dataset.runState = 'complete';
    suiteState.textContent = 'Passed';
    resultSummary.textContent = 'Release confidence: high';
    resultTime.textContent = 'Deterministic demo';
    runButton.disabled = false;
    runButton.querySelector('.button-label').textContent = 'Run the suite again';
  };

  const passStage = (stage, index) => {
    stage.dataset.state = 'passed';
    stage.querySelector(':scope > b').textContent = 'Passed';
    resultSummary.textContent = stage.dataset.evidence;
    updateProgress(Math.round(((index + 1) / stages.length) * 100));
  };

  const runSuite = async () => {
    const token = ++runToken;
    runButton.disabled = true;
    resetSuite();

    if (reducedMotion.matches) {
      stages.forEach(passStage);
      completeSuite();
      return;
    }

    for (let index = 0; index < stages.length; index += 1) {
      if (token !== runToken) return;
      const stage = stages[index];
      stage.dataset.state = 'running';
      stage.querySelector(':scope > b').textContent = 'Running';
      resultSummary.textContent = `${stage.querySelector('strong').textContent} checks running`;
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      if (token !== runToken) return;
      passStage(stage, index);
    }
    completeSuite();
  };

  runButton?.addEventListener('click', runSuite);
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) revealItems.forEach((item) => item.classList.add('is-visible'));
  });
  root.dataset.enhanced = 'true';
})();

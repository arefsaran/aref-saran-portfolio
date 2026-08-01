(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  const scrollTopButton = document.querySelector('.scroll-top');

  const setMenu = (open) => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.dataset.open = String(open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      menuButton?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (navigation?.dataset.open === 'true' && !header?.contains(event.target)) setMenu(false);
  });

  const syncScrollUI = () => {
    const hasScrolled = window.scrollY > 24;
    header?.classList.toggle('is-scrolled', hasScrolled);
    scrollTopButton?.classList.toggle('is-visible', window.scrollY > 700);
  };

  syncScrollUI();
  window.addEventListener('scroll', syncScrollUI, { passive: true });
  scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const counters = [...document.querySelectorAll('[data-count]')];
  const setCounterFinal = (counter) => {
    const value = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    counter.textContent = `${new Intl.NumberFormat('en-US').format(value)}${suffix}`;
  };

  const animateCounter = (counter) => {
    if (counter.dataset.animated === 'true') return;
    counter.dataset.animated = 'true';
    const target = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    const startedAt = performance.now();
    const duration = 1250;
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${new Intl.NumberFormat('en-US').format(Math.round(target * eased))}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    counters.forEach(setCounterFinal);
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .6 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const sectionTargets = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          if (active) link.setAttribute('aria-current', 'true');
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
    resultTime.textContent = '00:02';
    runButton.disabled = false;
    runButton.querySelector('.button-label').textContent = 'Run the suite again';
  };

  const runSuite = async () => {
    const token = ++runToken;
    runButton.disabled = true;
    resetSuite();

    if (reducedMotion.matches) {
      stages.forEach((stage) => {
        stage.dataset.state = 'passed';
        stage.querySelector(':scope > b').textContent = 'Passed';
      });
      updateProgress(100);
      completeSuite();
      return;
    }

    for (let index = 0; index < stages.length; index += 1) {
      if (token !== runToken) return;
      const stage = stages[index];
      stage.dataset.state = 'running';
      stage.querySelector(':scope > b').textContent = 'Running';
      resultSummary.textContent = `${stage.querySelector('strong').textContent} checks running`;
      await new Promise((resolve) => window.setTimeout(resolve, 430));
      if (token !== runToken) return;
      stage.dataset.state = 'passed';
      stage.querySelector(':scope > b').textContent = 'Passed';
      updateProgress((index + 1) * 25);
    }

    completeSuite();
  };

  runButton?.addEventListener('click', runSuite);

  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      counters.forEach(setCounterFinal);
    }
  });

  root.dataset.enhanced = 'true';
})();

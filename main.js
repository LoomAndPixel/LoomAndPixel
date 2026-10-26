// ==========================================================================
// LOOM & PIXEL — site script
// ==========================================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================================================
// SCROLL REVEAL: blocks fade up as they come into view, once each. Items in a
// row (cards, capabilities, logos) arrive one after another. The hidden start
// state only applies while <html> has .reveal-on (set in head.html).
// ==========================================================================
(function () {
  const root = document.documentElement;
  if (!root.classList.contains('reveal-on')) return;
  if (!('IntersectionObserver' in window)) { root.classList.remove('reveal-on'); return; }
  window.__revealReady = true;

  // [selector, ms this item adds to the cascade]. Text columns reveal piece by piece (label, heading,
  // each paragraph), never as one block; nothing here sits inside another revealed item.
  const groups = [
    ['.intro .label, .intro-text', 120],
    ['.section-head', 90],
    ['.work-grid > .project-card', 110],
    ['.capability', 90],
    ['.client-logo', 35],
    ['.studio-portrait', 140],
    ['.studio-text > *', 90],
    ['.contact-info > *:not(.check-list)', 90],
    ['.check-list li', 70],
    ['.form-wrapper', 120],
    ['.page-head > *', 90],
    ['.team-portrait', 140],
    ['.team-text > *:not(.prose)', 90],
    ['.team-text .prose > p', 110],
    ['.disciplines li', 50],
    ['.muted-note, .more-link', 90],
    ['.policy > *', 60],
    ['.project-head > *', 70],
    ['.project-text > *', 110],
    ['.video, .project-gallery img, .project-foot', 90],
    ['.portal-panel', 90],
    ['.not-found > *:not(.not-found-art):not(script)', 90],
  ];
  const targets = [];
  groups.forEach(([sel, step]) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      el.dataset.revealStep = step;
      targets.push(el);
    });
  });

  // Items that come into view together cascade in reading order; later ones arrive on their own.
  const io = new IntersectionObserver((entries) => {
    const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    let delay = 0;
    shown.forEach((el) => {
      el.style.setProperty('--reveal-delay', Math.min(delay, 1100) + 'ms');
      delay += +el.dataset.revealStep || 90;
      el.classList.add('is-visible');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach((el) => io.observe(el));
})();

// ==========================================================================
// PHONE MENU: the Menu button opens the full-screen nav; Escape or a link closes it
// ==========================================================================
const menuToggle = document.getElementById('menuToggle');
const siteHeader = document.querySelector('.site-header');

if (menuToggle && siteHeader) {
  const setMenu = (open) => {
    siteHeader.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.menu-toggle-text').textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuToggle.addEventListener('click', () => setMenu(!siteHeader.classList.contains('menu-open')));
  document.querySelectorAll('#siteNav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteHeader.classList.contains('menu-open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });
}

// ==========================================================================
// ANALYTICS EVENTS (Google Analytics, loaded in head.html). Only what happened
// and where is sent: never names, emails or message text.
// ==========================================================================
function track(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ page_path: location.pathname }, params || {}));
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  if (href.startsWith('mailto:')) {
    track('email_click', { link_location: a.closest('footer') ? 'footer' : (a.closest('header') ? 'header' : 'page') });
    return;
  }
  if (a.classList.contains('project-card')) {
    const title = (a.querySelector('.project-card-title') || {}).textContent || href;
    track('select_content', { content_type: 'project', item_id: title.trim() });
    if (a.querySelector('.watch-badge')) track('watch_click', { item_id: title.trim() });
  }
});

// ==========================================================================
// CONTACT FORM (Web3Forms): sends in the background and shows a thank-you
// ==========================================================================
const form = document.getElementById('pixelForm');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const responseDiv = document.getElementById('formResponse');

    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then((response) => {
        if (response.status == 200) {
          form.style.display = 'none';
          responseDiv.hidden = false;
          track('generate_lead', { form_name: location.pathname === '/contact/' ? 'contact_page' : 'homepage' });   // only after a real send
        } else {
          submitBtn.innerText = 'Send message';
          submitBtn.disabled = false;
          alert('Something went wrong. Please try again.');
        }
      })
      .catch(() => {
        submitBtn.innerText = 'Send message';
        submitBtn.disabled = false;
        alert('Network error. Please try again later.');
      });
  });
}

// ==========================================================================
// FOOTER COPYRIGHT YEAR: uses the visitor's clock so it rolls over on Jan 1
// without a rebuild. The year Jekyll wrote at build time stays as the fallback.
// ==========================================================================
const footerYear = document.getElementById('footerYear');

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// ==========================================================================
// FOOTER SEAL = BACK TO TOP (keyboard accessible button)
// ==========================================================================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// ==========================================================================
// MOTION: hero background loop and project-card loops. Skipped entirely for
// reduced motion or data saver, which keep the poster and cover stills.
// ==========================================================================
(function () {
  const saveData = navigator.connection && navigator.connection.saveData;
  if (prefersReducedMotion || saveData || !('IntersectionObserver' in window)) return;

  // Hero: 720p on small screens, plays only while on screen, with a pause button.
  const hero = document.querySelector('.hero-video');
  if (hero) {
    const pauseBtn = document.querySelector('.hero-pause');
    let userPaused = false;
    hero.src = window.innerWidth <= 900 ? hero.dataset.srcSmall : hero.dataset.src;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused) hero.play().catch(() => {});
      else hero.pause();
    }).observe(hero);
    if (pauseBtn) {
      pauseBtn.hidden = false;
      pauseBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        if (userPaused) hero.pause(); else hero.play().catch(() => {});
        pauseBtn.classList.toggle('is-paused', userPaused);
        pauseBtn.setAttribute('aria-label', userPaused ? 'Play background video' : 'Pause background video');
      });
    }
  }

  // Cards: hover (or keyboard focus) plays on desktop; on touch screens a card
  // plays while it sits mostly in view. The file loads on first use only.
  const canHover = window.matchMedia('(hover: hover)').matches;
  const start = (v) => {
    if (!v.src) v.src = v.dataset.src;
    v.play().then(() => v.classList.add('is-playing')).catch(() => {});
  };
  const stop = (v) => { v.pause(); v.classList.remove('is-playing'); };

  const loops = document.querySelectorAll('.card-loop');
  if (canHover) {
    // Load each file as its card nears the screen so the first hover plays at once.
    const preloader = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (!e.target.src) e.target.src = e.target.dataset.src;
        preloader.unobserve(e.target);
      });
    }, { rootMargin: '300px' });
    loops.forEach((v) => preloader.observe(v));
    loops.forEach((v) => {
      const card = v.closest('.project-card');
      card.addEventListener('mouseenter', () => start(v));
      card.addEventListener('mouseleave', () => stop(v));
      card.addEventListener('focus', () => start(v));
      card.addEventListener('blur', () => stop(v));
    });
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.intersectionRatio >= 0.6 ? start(e.target) : stop(e.target)));
    }, { threshold: [0, 0.6] });
    loops.forEach((v) => io.observe(v));
  }
})();

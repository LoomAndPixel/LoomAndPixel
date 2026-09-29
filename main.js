// ==========================================================================
// LOOM & PIXEL — site script
// ==========================================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

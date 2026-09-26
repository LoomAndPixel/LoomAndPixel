// ==========================================================================
// ACCESSIBILITY: honor the visitor's OS "reduce motion" setting
// ==========================================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================================================
// LOGO KINETIC PHYSICS ENGINE
// ==========================================================================
const letters = Array.from(document.querySelectorAll('.header-logo .logo-letter'));

// Physics Tuning Constants
const maxDistance = 150; // The radius (in pixels) of the gravitational capture zone around the mouse
const pullStrength = 0.45; // Max pull coefficient (0.45 = letter pulls up to 45% of the way to the cursor)
const easing = 0.15; // Share of the remaining distance a letter travels each frame (lower = floatier)

// SAFETY LATCH: Only run the logo tracking math if the logo exists on the page
// (and the visitor hasn't asked for reduced motion)
if (letters.length && !prefersReducedMotion) {
  // Each letter's current offset from its resting spot
  const offsets = letters.map(() => ({ x: 0, y: 0 }));
  let mouse = null; // null = cursor has left the page, so letters drift home
  let frame = null;

  function tick() {
    // Read every letter's position first, then write, so the browser only lays out once per frame
    const rests = letters.map((letter, i) => {
      const rect = letter.getBoundingClientRect();
      // Subtract our own offset so the pull is measured from where the letter rests, not where it's been dragged
      return {
        x: rect.left + rect.width / 2 - offsets[i].x,
        y: rect.top + rect.height / 2 - offsets[i].y,
      };
    });

    let moving = false;

    letters.forEach((letter, i) => {
      let targetX = 0;
      let targetY = 0;

      if (mouse) {
        const deltaX = mouse.x - rests[i].x;
        const deltaY = mouse.y - rests[i].y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < maxDistance) {
          // INVERSE PROXIMITY FORMULA: the closer the cursor, the stronger the pull
          const proximityFactor = (maxDistance - distance) / maxDistance;
          targetX = deltaX * pullStrength * proximityFactor;
          targetY = deltaY * pullStrength * proximityFactor;
        }
      }

      // Ease toward the target instead of jumping, like a letter on a spring
      const o = offsets[i];
      o.x += (targetX - o.x) * easing;
      o.y += (targetY - o.y) * easing;
      if (Math.abs(targetX - o.x) > 0.05 || Math.abs(targetY - o.y) > 0.05) moving = true;

      // The separate `translate` property is used on purpose: the intro animation holds `transform`,
      // which would override any movement written to `transform` here
      letter.style.translate = `${o.x.toFixed(2)}px ${o.y.toFixed(2)}px`;
    });

    // Keep animating while anything is still settling; sleep otherwise
    frame = moving ? requestAnimationFrame(tick) : null;
  }

  function wake() {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  // Listen across the whole page so the field reaches its full radius, not just the logo's box
  window.addEventListener('mousemove', (e) => {
    mouse = { x: e.clientX, y: e.clientY };
    wake();
  });

  // GLOBAL RESET TRACKER: cursor left the window, so everything drifts home
  document.documentElement.addEventListener('mouseleave', () => {
    mouse = null;
    wake();
  });

  // Scrolling moves the logo under a still cursor, so re-check
  window.addEventListener('scroll', wake, { passive: true });
}

// ==========================================================================
// GLYPH MATRIX DECRYPT ENGINE (HIGH-VELOCITY BLUE GLITCH EDITION)
// ==========================================================================
(function() {
  const triggers = document.querySelectorAll('.decrypt-trigger');
  
  if (!triggers.length) return; // Safety latch: exits cleanly if not on a page with decrypt targets

  const matrixLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*()<>[]{}";

  triggers.forEach(trigger => {
    let interval = null;
    const defaultText = trigger.dataset.default;
    const hoverText = trigger.dataset.hover;

    // Safety latch: skip links missing data-default / data-hover (otherwise the loop below
    // throws before it can clear itself and keeps erroring every 15ms)
    if (!defaultText || !hoverText) return;

    // Reduced motion: swap the text instantly, no scramble
    if (prefersReducedMotion) {
      trigger.addEventListener('mouseenter', () => { trigger.innerText = hoverText; });
      trigger.addEventListener('mouseleave', () => { trigger.innerText = defaultText; });
      return;
    }

    // TARGET: Dynamic Hover Translation Matrix (Hyper-Snappy + Blue Trail)
    trigger.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(interval);

      // Dropped clock ticks down to 15ms for an incredibly dense, cinematic stream
      interval = setInterval(() => {
        trigger.innerHTML = hoverText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return hoverText[index];
            }
            if (letter === " ") {
              return " ";
            }
            // Injects dynamic branding color spans with a subtle glowing edge aura
            const randomGlyph = matrixLetters[Math.floor(Math.random() * matrixLetters.length)];
            return `<span style="color: #00c8ff; text-shadow: 0 0 8px rgba(0, 200, 255, 0.4); font-weight: 400;">${randomGlyph}</span>`;
          })
          .join("");

        if (iteration >= hoverText.length) {
          trigger.innerText = hoverText; // Strips internal active HTML markup completely upon lock-in
          clearInterval(interval);
        }
        
        iteration += 1 / 1.5; // Accelerated loop steps to process string at high speed
      }, 15);
    });

    // RECOVERY: Returns cleanly to baseline layout anchor (Hyper-Snappy + Blue Trail)
    trigger.addEventListener('mouseleave', () => {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        trigger.innerHTML = defaultText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return defaultText[index];
            }
            if (letter === " ") {
              return " ";
            }
            const randomGlyph = matrixLetters[Math.floor(Math.random() * matrixLetters.length)];
            return `<span style="color: #00c8ff; text-shadow: 0 0 8px rgba(0, 200, 255, 0.4); font-weight: 400;">${randomGlyph}</span>`;
          })
          .join("");

        if (iteration >= defaultText.length) {
          trigger.innerText = defaultText;
          clearInterval(interval);
        }
        
        iteration += 1 / 1.2;
      }, 15);
    });
  });
})();

// ==========================================================================
// ASYNCHRONOUS BACKGROUND INTAKE PIPELINE (WEB3FORMS CUSTOM INTERCEPT)
// ==========================================================================
const form = document.getElementById('pixelForm');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Retains the client strictly on the Loom & Pixel platform
    
    const submitBtn = document.getElementById('submitBtn');
    const responseDiv = document.getElementById('formResponse');
    
    // UI Visual Feedback: Signals structural transmission state
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(form);

    // Stream package data parameters to Web3Forms core processing cloud
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(async (response) => {
        if (response.status == 200) {
            // Smoothly remove form layout block and display inline custom success card
            form.style.display = 'none';
            responseDiv.style.display = 'block';
        } else {
            // Restore interactive components upon server side deflection
            submitBtn.innerText = "Send Message";
            submitBtn.disabled = false;
            alert("Something went wrong. Please try again.");
        }
    })
    .catch(error => {
        // Fallback catch handles offline or connection drops cleanly
        submitBtn.innerText = "Send Message";
        submitBtn.disabled = false;
        alert("Network error. Please try again later.");
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
// FOOTER BACK-TO-TOP (keyboard accessible button)
// ==========================================================================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

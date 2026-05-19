// ==========================================================================
// LOGO KINETIC PHYSICS ENGINE
// ==========================================================================
const logoContainer = document.querySelector('.logo-magnetic-field');
const letters = document.querySelectorAll('.logo-letter');

// Physics Tuning Constants
const maxDistance = 150; // The radius (in pixels) of the gravitational capture zone around the mouse
const pullStrength = 0.45; // Max pull coefficient (0.45 = letter pulls up to 45% of the way to the cursor)

// SAFETY LATCH: Only run the logo tracking math if the logo element exists on the page
if (logoContainer) {
  logoContainer.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      
      // Calculate the absolute spatial center coordinates of this specific character span
      const letterX = rect.left + rect.width / 2;
      const letterY = rect.top + rect.height / 2;

      // Pythagorean theorem: Calculate absolute line distance from cursor to character center
      const deltaX = mouseX - letterX;
      const deltaY = mouseY - letterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If the cursor is inside the letter's proximity threshold zone...
      if (distance < maxDistance) {
        // INVERSE PROXIMITY FORMULA: Strength spikes higher the closer the mouse gets
        // This forces an organic exponential drop-off curve
        const proximityFactor = (maxDistance - distance) / maxDistance; 
        
        // Calculate dynamic spatial translation offsets
        const targetX = deltaX * pullStrength * proximityFactor;
        const targetY = deltaY * pullStrength * proximityFactor;

        // Temporarily strip the CSS transition so tracking follows the mouse cursor with zero lag
        letter.style.transition = 'none';
        letter.style.transform = `translate(${targetX}px, ${targetY}px)`;
      } else {
        // Restore default transition snap loop if mouse drifts past this letter's boundary
        letter.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), color 0.3s ease';
        letter.style.transform = 'translate(0px, 0px)';
      }
    });
  });

  // GLOBAL RESET TRACKER: If cursor breaks out of the global container, snap everything home completely
  logoContainer.addEventListener('mouseleave', () => {
    letters.forEach((letter) => {
      letter.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), color 0.3s ease';
      letter.style.transform = 'translate(0px, 0px)';
    });
  });
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

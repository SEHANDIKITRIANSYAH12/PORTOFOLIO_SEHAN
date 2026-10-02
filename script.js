/**
 * SEHAN DIKITRIANSYAH - HERO INTERACTIVE ENGINE
 * Features:
 * 1. Infinite Kinetic Marquee with dynamic mouse inertia / drag physics
 * 2. 3D Subtle Tilt & Parallax on subject photo
 * 3. macOS Dock physics magnification
 * 4. Smooth custom cursor with lerp tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMarquee();
  initParallax();
  initDockMagnification();
  initScrollReveal();
  initAnimatedCounters();
  initLiveClock();
  initScrollSpy();
  initProjectFilters();
  initCardTiltAndSpotlight();
  initMagneticButtons();
});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const circle = document.getElementById('cursorCircle');
  
  if (!dot || !circle || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let circleX = mouseX;
  let circleY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth trailing circle with lerp
  function renderCursor() {
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;
    circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Interactive Hover expansion
  const interactives = document.querySelectorAll('a, button, .brand-tag, .hero-side-badge, .marquee-track-container');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   2. INFINITE KINETIC MARQUEE (Awwwards Style Physics)
   ========================================================================== */
function initMarquee() {
  const container = document.getElementById('marqueeTrack');
  const contents = container.querySelectorAll('.marquee-content');
  if (!container || contents.length < 2) return;

  let baseSpeed = -1.2; // default automatic movement (pixels/frame)
  let currentSpeed = baseSpeed;
  let targetSpeed = baseSpeed;
  let position = 0;
  let contentWidth = contents[0].offsetWidth;

  // Update content width on resize
  window.addEventListener('resize', () => {
    contentWidth = contents[0].offsetWidth;
  });

  // Mouse velocity acceleration
  let lastMouseX = null;
  let mouseVelocity = 0;

  window.addEventListener('mousemove', (e) => {
    if (lastMouseX !== null) {
      mouseVelocity = (e.clientX - lastMouseX) * 0.35;
      targetSpeed = baseSpeed + mouseVelocity;
    }
    lastMouseX = e.clientX;
  });

  // Touch & Mouse Drag on Marquee
  let isDragging = false;
  let startX = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      startX = e.clientX;
      position += deltaX * 1.5;
    }
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const deltaX = e.touches[0].clientX - startX;
      startX = e.touches[0].clientX;
      position += deltaX * 1.5;
    }
  }, { passive: true });

  // Main Animation Loop with Inertia
  function loop() {
    // Smoothly return target speed back to baseSpeed
    targetSpeed += (baseSpeed - targetSpeed) * 0.05;
    currentSpeed += (targetSpeed - currentSpeed) * 0.1;

    if (!isDragging) {
      position += currentSpeed;
    }

    // Wrap around for infinite loop
    if (contentWidth > 0) {
      if (position <= -contentWidth) {
        position += contentWidth;
      } else if (position > 0) {
        position -= contentWidth;
      }
    }

    contents[0].style.transform = `translate3d(${position}px, 0, 0)`;
    contents[1].style.transform = `translate3d(${position}px, 0, 0)`;

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ==========================================================================
   3. 3D SUBTLE TILT & PARALLAX ON HERO IMAGE
   ========================================================================== */
function initParallax() {
  const portrait = document.getElementById('heroPortrait');
  if (!portrait || window.matchMedia('(pointer: coarse)').matches) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;

    targetX = normX * 18; // px horizontal shift
    targetY = normY * 12; // px vertical shift
  });

  function renderParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    portrait.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.02)`;
    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}

/* ==========================================================================
   4. macOS DOCK MAGNIFICATION EFFECT
   ========================================================================== */
function initDockMagnification() {
  const dockBar = document.getElementById('dockBar');
  if (!dockBar) return;

  const items = dockBar.querySelectorAll('.dock-item');
  const maxScale = 1.35;
  const maxDistance = 100; // range of magnification influence

  dockBar.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - itemCenterX);

      if (distance < maxDistance) {
        const scale = 1 + (maxScale - 1) * Math.cos((distance / maxDistance) * (Math.PI / 2));
        item.style.transform = `translateY(-${(scale - 1) * 16}px) scale(${scale})`;
      } else {
        item.style.transform = 'translateY(0) scale(1)';
      }
    });
  });

  dockBar.addEventListener('mouseleave', () => {
    items.forEach((item) => {
      item.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Dock item click active indicator toggle
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ==========================================================================
   5. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach((counter) => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * target);

            counter.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   7. LIVE REAL-TIME TIMEZONE CLOCK (GMT+7 WIB)
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    // Format to Asia/Jakarta (WIB GMT+7)
    const options = {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockEl.textContent = `Indonesia (GMT+7) — ${timeString} WIB`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   8. SCROLL SPY FOR DOCK NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = [
    { id: 'hero', dockHref: '#hero' },
    { id: 'about', dockHref: '#about' },
    { id: 'skills', dockHref: '#skills' },
    { id: 'education', dockHref: '#education' },
    { id: 'certifications', dockHref: '#education' },
    { id: 'projects', dockHref: '#projects' }
  ];

  const dockItems = document.querySelectorAll('.dock-item');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(({ id, dockHref }) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          dockItems.forEach(item => {
            if (item.getAttribute('href') === dockHref) {
              item.classList.add('active');
            } else if (['#hero', '#about', '#skills', '#education', '#projects'].includes(item.getAttribute('href'))) {
              item.classList.remove('active');
            }
          });
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   9. INTERACTIVE PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('is-hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
        }
      });
    });
  });
}

/* ==========================================================================
   10. INTERACTIVE 3D TILT & SPOTLIGHT MOUSE ENGINE
   ========================================================================== */
function initCardTiltAndSpotlight() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Spotlight on Category & Project Cards
  const spotlightCards = document.querySelectorAll('.skill-category-card, .project-card, .education-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 3D Perspective Tilt on Stats & Certificate Cards
  const tiltCards = document.querySelectorAll('.stat-card, .cert-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; // deg
      const rotateY = ((x - centerX) / centerX) * 8;  // deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   11. MAGNETIC BUTTON PHYSICS
   ========================================================================== */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .hero-side-badge');

  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Magnetic pull factor
      el.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0) scale(1.04)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0, 0, 0) scale(1)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   12. INTERACTIVE GALLERY LIGHTBOX MODAL
   ========================================================================== */
function openLightbox(src, title, desc) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const t = document.getElementById('lightboxTitle');
  const d = document.getElementById('lightboxDesc');

  if (!modal || !img) return;

  img.src = src;
  if (t) t.textContent = title;
  if (d) d.textContent = desc;

  modal.classList.add('is-open');
}

function closeLightboxDirect() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('is-open');
  }
}

function closeLightbox(e) {
  if (e.target.id === 'lightboxModal') {
    closeLightboxDirect();
  }
}

// Escape key to close modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightboxDirect();
  }
});




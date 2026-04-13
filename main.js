/* ════════════════════════════════════════
   main.js — Dr. Pratyush Ghosh Website
════════════════════════════════════════ */

/* ══════════════════════════════
   1. SCROLL PROGRESS BAR
══════════════════════════════ */
const bar = document.getElementById('progress-bar');

function updateBar() {
  const scrolled  = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct       = Math.min((scrolled / maxScroll) * 100, 100);
  bar.style.width = pct + '%';
}

window.addEventListener('scroll', updateBar, { passive: true });


/* ══════════════════════════════
   2. NAV SHRINK ON SCROLL
══════════════════════════════ */
const nav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 55);
}, { passive: true });


/* ══════════════════════════════
   3. MOBILE HAMBURGER MENU
══════════════════════════════ */
const hbg    = document.getElementById('hamburger');
const nLinks = document.getElementById('nav-links');

hbg.addEventListener('click', () => {
  const open  = nLinks.classList.toggle('open');
  const spans = hbg.querySelectorAll('span');
  const [a, b, c] = spans;

  a.style.transform = open ? 'rotate(45deg) translate(4px, 4px)'  : '';
  b.style.opacity   = open ? '0' : '1';
  c.style.transform = open ? 'rotate(-45deg) translate(4px, -4px)' : '';
});

// Close menu on nav link click
nLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nLinks.classList.remove('open');
    hbg.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '1';
    });
  });
});


/* ══════════════════════════════
   4. PARTICLE CANVAS BACKGROUND
══════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Create particles
  const pts = Array.from({ length: 60 }, () => ({
    x:  Math.random() * 1920,
    y:  Math.random() * 1080,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r:  Math.random() * 1.5 + 0.4,
    o:  Math.random() * 0.35 + 0.08
  }));

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);

        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(31, 184, 168, ${0.13 * (1 - d / 130)})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and move dots
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(31, 184, 168, ${p.o})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = W;  if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;  if (p.y > H) p.y = 0;
    }

    requestAnimationFrame(frame);
  }

  frame();
})();


/* ══════════════════════════════
   5. 3D PHOTO CARD TILT
══════════════════════════════ */
const card3d = document.getElementById('photo3d');

if (card3d) {
  card3d.addEventListener('mousemove', e => {
    const rect = card3d.getBoundingClientRect();
    const x = (e.clientX - rect.left)  / rect.width  - 0.5;
    const y = (e.clientY - rect.top)   / rect.height - 0.5;

    card3d.style.transition = 'transform 0.08s ease, box-shadow 0.4s';
    card3d.style.transform  = `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 11}deg) scale(1.04)`;
    card3d.style.boxShadow  = `${-x * 20}px ${-y * 15}px 50px rgba(0, 0, 0, 0.5)`;
  });

  card3d.addEventListener('mouseleave', () => {
    card3d.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s';
    card3d.style.transform  = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
    card3d.style.boxShadow  = '';
  });
}


/* ══════════════════════════════
   6. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Staggered delays per group
document.querySelectorAll('.timeline-item').forEach((el, i) => {
  el.dataset.delay = i * 130;
  revealObserver.observe(el);
});

document.querySelectorAll('.skill-chip').forEach((el, i) => {
  el.dataset.delay = i * 50;
  revealObserver.observe(el);
});

document.querySelectorAll('.edu-card').forEach((el, i) => {
  el.dataset.delay = i * 90;
  revealObserver.observe(el);
});


/* ══════════════════════════════
   7. COUNTER ANIMATION
══════════════════════════════ */
function countUp(el, target, suffix, duration = 1200) {
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    el.innerHTML = Math.floor(eased * target) + '<span class="suf">' + suffix + '</span>';

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Trigger counters when stats row enters view
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(document.getElementById('sn1'), 5,  '+');
      countUp(document.getElementById('sn2'), 12, '+');
      countUp(document.getElementById('sn3'), 5,  '+');
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.6 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

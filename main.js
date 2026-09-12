/* ════════════════════════════════════════
   main.js — Dr. Pratyush Ghosh Website
════════════════════════════════════════ */

/* ══════════════════════════════
   1. SCROLL PROGRESS BAR
══════════════════════════════ */

const bar = document.getElementById('progress-bar');

function updateBar() {
  if (!bar) return;

  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  const pct =
    maxScroll > 0
      ? Math.min((scrolled / maxScroll) * 100, 100)
      : 0;

  bar.style.width = pct + '%';
}

window.addEventListener('scroll', updateBar, { passive: true });
updateBar();


/* ══════════════════════════════
   2. NAV SHRINK ON SCROLL
══════════════════════════════ */

const nav = document.getElementById('main-nav');

if (nav) {
  function updateNavigation() {
    nav.classList.toggle('scrolled', window.scrollY > 55);
  }

  window.addEventListener('scroll', updateNavigation, {
    passive: true
  });

  updateNavigation();
}


/* ══════════════════════════════
   3. MOBILE HAMBURGER MENU
══════════════════════════════ */

const hbg = document.getElementById('hamburger');
const nLinks = document.getElementById('nav-links');

if (hbg && nLinks) {

  function setMenuState(open) {

    nLinks.classList.toggle('open', open);
    nLinks.classList.toggle('active', open);

    hbg.setAttribute(
      'aria-expanded',
      open ? 'true' : 'false'
    );

    const spans = hbg.querySelectorAll('span');
    const [a, b, c] = spans;

    if (a) {
      a.style.transform = open
        ? 'rotate(45deg) translate(4px, 4px)'
        : '';
    }

    if (b) {
      b.style.opacity = open ? '0' : '1';
    }

    if (c) {
      c.style.transform = open
        ? 'rotate(-45deg) translate(4px, -4px)'
        : '';
    }
  }


  function toggleMenu() {
    const open = !nLinks.classList.contains('open');
    setMenuState(open);
  }


  hbg.addEventListener('click', toggleMenu);


  hbg.addEventListener('keydown', event => {

    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      toggleMenu();
    }

  });


  nLinks.querySelectorAll('a').forEach(link => {

    link.addEventListener('click', () => {
      setMenuState(false);
    });

  });


  document.addEventListener('click', event => {

    if (
      window.innerWidth <= 700 &&
      nav &&
      !nav.contains(event.target)
    ) {
      setMenuState(false);
    }

  });


  window.addEventListener('resize', () => {

    if (window.innerWidth > 700) {
      setMenuState(false);
    }

  }, { passive: true });

}


/* ══════════════════════════════
   4. PARTICLE CANVAS BACKGROUND
══════════════════════════════ */

(function initParticles() {

  const canvas = document.getElementById('bg-canvas');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  let W;
  let H;


  function resize() {

    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

  }


  resize();


  window.addEventListener('resize', resize, {
    passive: true
  });


  const particleCount =
    window.innerWidth <= 700 ? 35 : 60;


  const pts = Array.from(
    { length: particleCount },
    () => ({

      x: Math.random() * W,

      y: Math.random() * H,

      vx:
        (Math.random() - 0.5) * 0.22,

      vy:
        (Math.random() - 0.5) * 0.22,

      r:
        Math.random() * 1.5 + 0.4,

      o:
        Math.random() * 0.35 + 0.08

    })
  );


  function frame() {

    ctx.clearRect(
      0,
      0,
      W,
      H
    );


    /* Draw connecting lines */

    for (
      let i = 0;
      i < pts.length;
      i++
    ) {

      for (
        let j = i + 1;
        j < pts.length;
        j++
      ) {

        const dx =
          pts[i].x - pts[j].x;

        const dy =
          pts[i].y - pts[j].y;

        const d =
          Math.hypot(dx, dy);


        if (d < 130) {

          ctx.beginPath();

          ctx.strokeStyle =
            `rgba(
              31,
              184,
              168,
              ${0.13 * (1 - d / 130)}
            )`;

          ctx.lineWidth = 0.5;

          ctx.moveTo(
            pts[i].x,
            pts[i].y
          );

          ctx.lineTo(
            pts[j].x,
            pts[j].y
          );

          ctx.stroke();

        }

      }

    }


    /* Draw and move particles */

    for (const p of pts) {

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.r,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(
          31,
          184,
          168,
          ${p.o}
        )`;

      ctx.fill();


      p.x += p.vx;
      p.y += p.vy;


      /* Wrap around edges */

      if (p.x < 0) {
        p.x = W;
      }

      if (p.x > W) {
        p.x = 0;
      }

      if (p.y < 0) {
        p.y = H;
      }

      if (p.y > H) {
        p.y = 0;
      }

    }


    requestAnimationFrame(frame);

  }


  frame();

})();


/* ══════════════════════════════
   5. 3D PHOTO CARD TILT
══════════════════════════════ */

const card3d =
  document.getElementById('photo3d');


const isTouchDevice =
  window.matchMedia('(hover: none)').matches;


if (
  card3d &&
  !isTouchDevice
) {

  card3d.addEventListener(
    'mousemove',
    event => {

      const rect =
        card3d.getBoundingClientRect();


      const x =
        (event.clientX - rect.left)
        / rect.width
        - 0.5;


      const y =
        (event.clientY - rect.top)
        / rect.height
        - 0.5;


      card3d.style.transition =
        'transform 0.08s ease, box-shadow 0.4s';


      card3d.style.transform =
        `perspective(900px)
         rotateY(${x * 16}deg)
         rotateX(${-y * 11}deg)
         scale(1.04)`;


      card3d.style.boxShadow =
        `${-x * 20}px
         ${-y * 15}px
         50px
         rgba(0, 0, 0, 0.5)`;

    }
  );


  card3d.addEventListener(
    'mouseleave',
    () => {

      card3d.style.transition =
        'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s';


      card3d.style.transform =
        'perspective(900px) rotateY(0) rotateX(0) scale(1)';


      card3d.style.boxShadow = '';

    }
  );

}


/* ══════════════════════════════
   6. SCROLL REVEAL
══════════════════════════════ */

/*
   IMPORTANT FIX:
   Clinical Experience, Skills and Education
   cards are initially hidden by CSS.

   This section makes them visible when they
   enter the viewport.
*/

let revealObserver = null;


if ('IntersectionObserver' in window) {

  revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            const delay =
              parseInt(
                entry.target.dataset.delay,
                10
              ) || 0;


            setTimeout(() => {

              entry.target.classList.add(
                'visible'
              );

            }, delay);


            revealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
      }
    );

}


/*
   FALLBACK / SAFETY REVEAL

   If an element is still hidden for any
   reason, make sure the page does not
   remain blank.
*/

function revealElement(el) {

  if (!el) return;

  el.classList.add('visible');

}


/*
   Timeline / Clinical Experience
*/

document
  .querySelectorAll('.timeline-item')
  .forEach((el, i) => {

    el.dataset.delay = i * 130;

    if (revealObserver) {

      revealObserver.observe(el);

    } else {

      revealElement(el);

    }

  });


/*
   Skills / Procedures
*/

document
  .querySelectorAll('.skill-chip')
  .forEach((el, i) => {

    el.dataset.delay = i * 50;

    if (revealObserver) {

      revealObserver.observe(el);

    } else {

      revealElement(el);

    }

  });


/*
   Education
*/

document
  .querySelectorAll('.edu-card')
  .forEach((el, i) => {

    el.dataset.delay = i * 90;

    if (revealObserver) {

      revealObserver.observe(el);

    } else {

      revealElement(el);

    }

  });


/*
   Extra safety check.

   If cards remain hidden because of
   another CSS/observer issue, reveal
   them after a short delay.
*/

setTimeout(() => {

  document
    .querySelectorAll(
      '.timeline-item, .skill-chip, .edu-card'
    )
    .forEach(el => {

      const rect =
        el.getBoundingClientRect();

      const visibleOnScreen =
        rect.top < window.innerHeight &&
        rect.bottom > 0;


      if (visibleOnScreen) {

        el.classList.add('visible');

      }

    });

}, 1500);


/*
   Blog cards are created dynamically,
   so they must be observed after loading.
*/

function observeBlogCards() {

  document
    .querySelectorAll('.blog-card')
    .forEach((el, i) => {

      if (
        el.dataset.revealObserved
      ) {
        return;
      }


      el.dataset.delay =
        i * 100;


      el.dataset.revealObserved =
        'true';


      if (revealObserver) {

        revealObserver.observe(el);

      } else {

        el.classList.add('visible');

      }

    });

}


/* ══════════════════════════════
   7. COUNTER ANIMATION
══════════════════════════════ */

function countUp(
  el,
  target,
  suffix,
  duration = 1200
) {

  if (!el) return;


  const startTime =
    performance.now();


  function tick(now) {

    const elapsed =
      now - startTime;


    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    el.innerHTML =
      Math.floor(
        eased * target
      ) +
      '<span class="suf">' +
      suffix +
      '</span>';


    if (progress < 1) {

      requestAnimationFrame(
        tick
      );

    }

  }


  requestAnimationFrame(tick);

}


/*
   Trigger counters when stats row
   enters the viewport.
*/

if ('IntersectionObserver' in window) {

  const statsObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            countUp(
              document.getElementById('sn1'),
              5,
              '+'
            );


            countUp(
              document.getElementById('sn2'),
              12,
              '+'
            );


            countUp(
              document.getElementById('sn3'),
              5,
              '+'
            );


            statsObserver.disconnect();

          }

        });

      },
      {
        threshold: 0.6
      }
    );


  const statsEl =
    document.querySelector(
      '.hero-stats'
    );


  if (statsEl) {

    statsObserver.observe(
      statsEl
    );

  }

}


/* ══════════════════════════════
   8. DYNAMIC BLOG POSTS
══════════════════════════════ */

/*
   The blog website should expose:

   https://pratyushblogs.netlify.app/posts.json

   Example:

   [
     {
       "title": "Diabetes Awareness",
       "description": "Understanding diabetes...",
       "category": "Health Awareness",
       "date": "2026-09-12",
       "readTime": "7 min read",
       "url": "https://pratyushblogs.netlify.app/diabetes-awareness/"
     }
   ]
*/


const BLOG_FEED_URL =
  'https://pratyushblogs.netlify.app/posts.json';


const BLOG_HOME_URL =
  'https://pratyushblogs.netlify.app/';


let blogsLoaded = false;


async function loadLatestBlogs() {

  /*
     Prevent duplicate blog loading.
  */

  if (blogsLoaded) {
    return;
  }


  const blogsGrid =
    document.getElementById(
      'blogs-grid'
    );


  if (!blogsGrid) {
    return;
  }


  blogsLoaded = true;


  try {

    const response =
      await fetch(
        BLOG_FEED_URL,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );


    if (!response.ok) {

      throw new Error(
        `Blog feed returned ${response.status}`
      );

    }


    const posts =
      await response.json();


    if (!Array.isArray(posts)) {

      throw new Error(
        'Invalid blog feed format.'
      );

    }


    /*
       Sort newest first.
    */

    posts.sort(
      (a, b) => {

        return (
          new Date(b.date) -
          new Date(a.date)
        );

      }
    );


    /*
       Take only latest 3.
    */

    const latestPosts =
      posts.slice(0, 3);


    blogsGrid.innerHTML = '';


    /*
       No posts available.
    */

    if (
      latestPosts.length === 0
    ) {

      blogsGrid.innerHTML = `

        <div class="blogs-error">

          <p>
            No articles available yet.
          </p>

          <a
            href="${BLOG_HOME_URL}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit the Blog →
          </a>

        </div>

      `;

      return;

    }


    /*
       Create blog cards.
    */

    latestPosts.forEach(
      post => {

        const card =
          document.createElement(
            'article'
          );


        card.className =
          'blog-card';


        const title =
          post.title ||
          'Untitled Article';


        const description =
          post.description ||
          'Read the latest article from Dr. Pratyush Ghosh.';


        const category =
          post.category ||
          'Health & Awareness';


        const url =
          post.url ||
          BLOG_HOME_URL;


        const date =
          formatBlogDate(
            post.date
          );


        const readTime =
          post.readTime ||
          '';


        card.innerHTML = `

          <div class="blog-card-category">
            ${escapeHtml(category)}
          </div>


          <div class="blog-card-date">

            ${escapeHtml(date)}

            ${
              readTime
                ? ' · ' +
                  escapeHtml(readTime)
                : ''
            }

          </div>


          <h3>
            ${escapeHtml(title)}
          </h3>


          <p>
            ${escapeHtml(description)}
          </p>


          <a
            href="${escapeAttribute(url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="blog-read-more"
          >
            Read article →
          </a>

        `;


        blogsGrid.appendChild(
          card
        );

      }
    );


    /*
       Activate scroll reveal
       for dynamically-created
       blog cards.
    */

    observeBlogCards();


  } catch (error) {

    console.error(
      'Blog loading error:',
      error
    );


    /*
       Friendly fallback.
    */

    blogsGrid.innerHTML = `

      <div class="blogs-error">

        <p>
          Latest articles could not be loaded right now.
        </p>

        <a
          href="${BLOG_HOME_URL}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the Blog →
        </a>

      </div>

    `;

  }

}


/* ══════════════════════════════
   9. BLOG DATE FORMATTER
══════════════════════════════ */

function formatBlogDate(date) {

  if (!date) {
    return '';
  }


  const parsedDate =
    new Date(date);


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return '';

  }


  return parsedDate.toLocaleDateString(
    'en-IN',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  );

}


/* ══════════════════════════════
   10. HTML SECURITY HELPERS
══════════════════════════════ */

function escapeHtml(value) {

  const div =
    document.createElement(
      'div'
    );


  div.textContent =
    String(value);


  return div.innerHTML;

}


function escapeAttribute(value) {

  return String(value)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    );

}


/* ══════════════════════════════
   11. INITIALIZE BLOGS
══════════════════════════════ */

loadLatestBlogs();

/* ════════════════════════════════════════
   BLOG JS — DR. PRATYUSH GHOSH
   Combined JS for Blog Home + All Articles
════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const bar = document.getElementById('progress-bar');
  const nav = document.getElementById('main-nav');
  const hbg = document.getElementById('hamburger');
  const nLinks = document.getElementById('nav-links');
  const topBtn =
    document.getElementById('back-to-top') ||
    document.getElementById('top');


  /* ─────────────────────────────────────
     Scroll progress + compact navigation
  ───────────────────────────────────── */

  function onScroll() {

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const pct =
      maxScroll > 0
        ? Math.min((window.scrollY / maxScroll) * 100, 100)
        : 0;

    if (bar) {
      bar.style.width = pct + '%';
    }

    if (nav) {
      nav.classList.toggle(
        'scrolled',
        window.scrollY > 55
      );
    }

    if (topBtn) {
      topBtn.classList.toggle(
        'visible',
        window.scrollY > 500
      );
    }
  }


  window.addEventListener(
    'scroll',
    onScroll,
    { passive: true }
  );

  onScroll();


  /* ─────────────────────────────────────
     Back to top
  ───────────────────────────────────── */

  if (topBtn) {

    topBtn.addEventListener(
      'click',
      () => {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      }
    );

  }


  /* ─────────────────────────────────────
     Mobile navigation
  ───────────────────────────────────── */

  if (hbg && nLinks) {

    hbg.addEventListener('click', () => {

      const open =
        nLinks.classList.toggle('open');

      hbg.setAttribute(
        'aria-expanded',
        String(open)
      );


      const spans =
        hbg.querySelectorAll('span');

      const a = spans[0];
      const b = spans[1];
      const c = spans[2];


      if (a) {
        a.style.transform =
          open
            ? 'rotate(45deg) translate(4px, 4px)'
            : '';
      }

      if (b) {
        b.style.opacity =
          open ? '0' : '1';
      }

      if (c) {
        c.style.transform =
          open
            ? 'rotate(-45deg) translate(4px, -4px)'
            : '';
      }

    });


    nLinks
      .querySelectorAll('a')
      .forEach(link => {

        link.addEventListener('click', () => {

          nLinks.classList.remove('open');

          hbg.setAttribute(
            'aria-expanded',
            'false'
          );


          hbg
            .querySelectorAll('span')
            .forEach(span => {

              span.style.transform = '';
              span.style.opacity = '1';

            });

        });

      });

  }


  /* ─────────────────────────────────────
     Particle background
     Same teal visual language as website
  ───────────────────────────────────── */

  const canvas =
    document.getElementById('bg-canvas');


  if (
    canvas &&
    window.matchMedia &&
    !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {

    const ctx =
      canvas.getContext('2d');

    let W = 0;
    let H = 0;


    const resize = () => {

      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );


      W = window.innerWidth;
      H = window.innerHeight;


      canvas.width =
        Math.floor(W * dpr);

      canvas.height =
        Math.floor(H * dpr);


      canvas.style.width =
        W + 'px';

      canvas.style.height =
        H + 'px';


      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

    };


    resize();


    window.addEventListener(
      'resize',
      resize,
      { passive: true }
    );


    const pts =
      Array.from(
        { length: 55 },
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
            Math.random() * 0.30 + 0.07

        })
      );


    function frame() {

      ctx.clearRect(
        0,
        0,
        W,
        H
      );


      /* Draw particle connections */

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


          if (d < 125) {

            ctx.beginPath();

            ctx.strokeStyle =
              `rgba(
                31,
                184,
                168,
                ${0.11 * (1 - d / 125)}
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


      /* Draw particles */

      pts.forEach(p => {

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

      });


      requestAnimationFrame(frame);

    }


    frame();

  }


  /* ─────────────────────────────────────
     Reveal animations
  ───────────────────────────────────── */

  const revealItems =
    document.querySelectorAll('.reveal');


  if (
    'IntersectionObserver'
    in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'visible'
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealItems.forEach((el, i) => {

      el.style.transitionDelay =
        `${Math.min(i * 80, 240)}ms`;

      observer.observe(el);

    });

  } else {

    revealItems.forEach(el => {

      el.classList.add('visible');

    });

  }


  /* ─────────────────────────────────────
     Article count
  ───────────────────────────────────── */

  const count =
    document.getElementById(
      'article-count'
    );


  if (count) {

    count.textContent =
      document.querySelectorAll(
        '.blog-card'
      ).length;

  }


  /* ─────────────────────────────────────
     Footer year
  ───────────────────────────────────── */

  const year =
    document.getElementById('year');


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* ─────────────────────────────────────
     Diabetes type tabs
  ───────────────────────────────────── */

  document
    .querySelectorAll('.type-tab')
    .forEach(tab => {

      tab.addEventListener(
        'click',
        () => {

          document
            .querySelectorAll('.type-tab')
            .forEach(x => {
              x.classList.remove('active');
            });


          document
            .querySelectorAll('.type-panel')
            .forEach(x => {
              x.classList.remove('active');
            });


          tab.classList.add('active');


          const panel =
            document.getElementById(
              tab.dataset.type
            );


          if (panel) {
            panel.classList.add('active');
          }

        }
      );

    });


  /* ─────────────────────────────────────
     Article sidebar
     Highlight current section
  ───────────────────────────────────── */

  const sideLinks =
    Array.from(
      document.querySelectorAll(
        '.article-page .side a[href^="#"]'
      )
    );


  const sideSections =
    sideLinks
      .map(link => {

        const id =
          link
            .getAttribute('href')
            .slice(1);

        return document.getElementById(id);

      })
      .filter(Boolean);


  if (
    'IntersectionObserver'
    in window &&
    sideSections.length
  ) {

    const sideObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              sideLinks.forEach(
                link => {
                  link.classList.remove(
                    'active'
                  );
                }
              );


              const active =
                sideLinks.find(
                  link =>
                    link.getAttribute(
                      'href'
                    ) ===
                    '#' + entry.target.id
                );


              if (active) {
                active.classList.add(
                  'active'
                );
              }

            }

          });

        },
        {
          rootMargin:
            '-20% 0px -65% 0px',

          threshold: 0
        }
      );


    sideSections.forEach(
      section => {
        sideObserver.observe(section);
      }
    );

  }


  /* ─────────────────────────────────────
     Smooth article anchor navigation
  ───────────────────────────────────── */

  document
    .querySelectorAll(
      '.article-page .side a[href^="#"]'
    )
    .forEach(link => {

      link.addEventListener(
        'click',
        event => {

          const id =
            link
              .getAttribute('href')
              .slice(1);


          const target =
            document.getElementById(id);


          if (!target) {
            return;
          }


          event.preventDefault();


          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });


          history.replaceState(
            null,
            '',
            '#' + id
          );

        }
      );

    });


});

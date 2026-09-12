```javascript
/* =========================================================
   MAIN.JS
   Dr. Pratyush Ghosh — Portfolio
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav-links");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        nav &&
        hamburger &&
        !nav.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        nav.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  }

  /* =========================================================
     SMOOTH SCROLLING
     ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* =========================================================
     ACTIVE NAVIGATION ON SCROLL
     ========================================================= */

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const href = link.getAttribute("href");

      if (href === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  /* =========================================================
     SCROLL REVEAL
     ========================================================= */

  const revealElements = document.querySelectorAll(
    ".reveal, .fade-in, .slide-up, .animate-on-scroll"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =========================================================
     PARTICLES / BACKGROUND EFFECT
     ========================================================= */

  const particlesContainer = document.querySelector(".particles");

  if (particlesContainer) {
    const particleCount = window.innerWidth < 768 ? 20 : 40;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("span");

      particle.className = "particle";

      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${5 + Math.random() * 10}s`;

      particlesContainer.appendChild(particle);
    }
  }

  /* =========================================================
     PHOTO / CARD TILT EFFECT
     ========================================================= */

  const tiltElements = document.querySelectorAll(
    ".tilt, .profile-image, .hero-image"
  );

  tiltElements.forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 768) return;

      const rect = element.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      element.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });

  /* =========================================================
     COUNTER ANIMATION
     ========================================================= */

  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(counter) {
    const target = Number(counter.getAttribute("data-count"));

    if (Number.isNaN(target)) return;

    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      counter.textContent = Math.floor(
        easedProgress * target
      );

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  /* =========================================================
     CURRENT YEAR
     ========================================================= */

  const yearElements = document.querySelectorAll(
    "#current-year, .current-year"
  );

  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =========================================================
     BLOG LOADER
     ========================================================= */

  let blogsLoaded = false;

  async function loadLatestBlogs() {
    if (blogsLoaded) return;

    const blogGrid = document.getElementById("blogs-grid");

    if (!blogGrid) return;

    blogsLoaded = true;

    const BLOG_HOME = "https://pratyushblogs.netlify.app/";
    const POSTS_JSON =
      "https://pratyushblogs.netlify.app/posts.json";

    try {
      const response = await fetch(POSTS_JSON, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Blog feed returned ${response.status}`
        );
      }

      const posts = await response.json();

      if (!Array.isArray(posts) || posts.length === 0) {
        throw new Error("No blog posts found.");
      }

      /* Sort newest first */
      posts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateB - dateA;
      });

      /* Show only the latest 3 posts */
      const latestPosts = posts.slice(0, 3);

      blogGrid.innerHTML = "";

      latestPosts.forEach((post) => {
        const card = document.createElement("article");

        card.className = "blog-card";

        const title = escapeHTML(
          post.title || "Untitled Article"
        );

        const category = escapeHTML(
          post.category || "Health & Awareness"
        );

        const description = escapeHTML(
          post.description ||
            "Read the latest article on the blog."
        );

        const readTime = escapeHTML(
          post.readTime || ""
        );

        const formattedDate = formatBlogDate(post.date);

        const url = isSafeURL(post.url)
          ? post.url
          : BLOG_HOME;

        card.innerHTML = `
          <div class="blog-card-content">
            <div class="blog-card-category">
              ${category}
            </div>

            <h3 class="blog-card-title">
              ${title}
            </h3>

            <p class="blog-card-description">
              ${description}
            </p>

            <div class="blog-card-meta">
              <span class="blog-card-date">
                ${formattedDate}
              </span>

              ${
                readTime
                  ? `<span class="blog-card-read-time">
                      ${readTime}
                    </span>`
                  : ""
              }
            </div>

            <a
              class="blog-read-more"
              href="${url}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Article
              <span aria-hidden="true">→</span>
            </a>
          </div>
        `;

        blogGrid.appendChild(card);
      });

      /* Add "View All Blogs" button if it exists */
      const viewAllButton = document.querySelector(
        ".view-all-blogs"
      );

      if (viewAllButton) {
        viewAllButton.href = BLOG_HOME;
      }
    } catch (error) {
      console.error("Unable to load blog posts:", error);

      /*
       * Fallback:
       * If posts.json is unavailable, show a simple
       * link to the main blog instead of leaving
       * the section completely blank.
       */

      blogGrid.innerHTML = `
        <div class="blog-fallback">
          <p>
            Explore the latest articles and health
            awareness posts on my blog.
          </p>

          <a
            href="${BLOG_HOME}"
            target="_blank"
            rel="noopener noreferrer"
            class="blog-read-more"
          >
            Visit My Blog
            <span aria-hidden="true">→</span>
          </a>
        </div>
      `;
    }
  }

  /* =========================================================
     BLOG DATE FORMATTER
     ========================================================= */

  function formatBlogDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return escapeHTML(String(dateString));
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  /* =========================================================
     HTML ESCAPING
     ========================================================= */

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     SAFE URL CHECK
     ========================================================= */

  function isSafeURL(url) {
    if (!url || typeof url !== "string") {
      return false;
    }

    try {
      const parsedURL = new URL(url, window.location.href);

      return (
        parsedURL.protocol === "https:" ||
        parsedURL.protocol === "http:"
      );
    } catch {
      return false;
    }
  }

  /* =========================================================
     BLOG INITIALIZATION
     ========================================================= */

  loadLatestBlogs();
});
```

/* ===== GSAP + SCROLLTRIGGER REGISTRATION ===== */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initNavbar();
  initEvolutionTimeline();
  initSkillsReveal();
  initExperienceReveal();
  initPortfolioExpand();
  initSimpleReveals();
  initSmoothScroll();
  initMobileMenu();
});

/* ===== HERO ANIMATIONS (page load) ===== */
function initHeroAnimations() {
  // Typed.js for the label
  if (typeof Typed !== 'undefined') {
    new Typed('#typed-label', {
      strings: ['PLATFORM ENGINEER'],
      typeSpeed: 50,
      showCursor: true,
      cursorChar: '_',
      onComplete: (self) => {
        setTimeout(() => {
          if (self.cursor) self.cursor.style.display = 'none';
        }, 1500);
      }
    });
  }

  // GSAP staggered fade-up
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

  tl.from('.hero__portrait', { scale: 0.8, opacity: 0 }, 0.1)
    .from('.hero__name', { y: 40, opacity: 0 }, 0.3)
    .from('.hero__tagline', { y: 30, opacity: 0 }, 0.5)
    .from('.hero__summary', { y: 30, opacity: 0 }, 0.7)
    .from('.hero__cta', { y: 20, opacity: 0 }, 0.9)
    .from('.hero__scroll-hint', { opacity: 0 }, 1.2);
}

/* ===== NAVBAR (show/hide on scroll) ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('hero');
  if (!navbar || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0.05 }
  );

  observer.observe(hero);
}

/* ===== EVOLUTION TIMELINE (pinned scrub on desktop, static on mobile) ===== */
function initEvolutionTimeline() {
  const section = document.getElementById('evolution');
  const chapters = document.querySelectorAll('.evolution__chapter');
  const years = document.querySelectorAll('.evolution__year');
  const dot = document.querySelector('.evolution__dot');

  if (!section || chapters.length === 0) return;

  // On mobile, chapters are already visible via CSS (position: relative, opacity: 1)
  if (window.innerWidth <= 768) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    chapters.forEach(ch => ch.classList.add('active'));
    return;
  }

  // Desktop: show first chapter, scrub through on scroll
  chapters[0].classList.add('active');
  if (years[0]) years[0].classList.add('active');

  // Scroll to top on refresh to avoid stale scroll position in timeline
  if (window.scrollY > 0 && window.scrollY < section.offsetTop + section.offsetHeight) {
    window.scrollTo(0, 0);
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const progress = self.progress;
      const totalChapters = chapters.length;
      const chapterIndex = Math.min(
        Math.floor(progress * totalChapters),
        totalChapters - 1
      );

      chapters.forEach((ch, i) => {
        ch.classList.toggle('active', i === chapterIndex);
      });

      years.forEach((y, i) => {
        y.classList.toggle('active', i === chapterIndex);
      });

      if (dot) {
        dot.style.top = `${progress * 100}%`;
      }
    }
  });
}

/* ===== SKILLS REVEAL ===== */
function initSkillsReveal() {
  const bands = document.querySelectorAll('.skills__band');
  if (bands.length === 0) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    bands.forEach((band, index) => {
      gsap.to(band, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: band,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  } else {
    // Fallback with Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    bands.forEach(band => observer.observe(band));
  }
}

/* ===== EXPERIENCE CARDS REVEAL ===== */
function initExperienceReveal() {
  const cards = document.querySelectorAll('.experience__card');
  if (cards.length === 0) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    cards.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach(card => observer.observe(card));
  }
}

/* ===== PORTFOLIO EXPAND (accordion) ===== */
function initPortfolioExpand() {
  const cards = document.querySelectorAll('.portfolio__card[data-expandable]');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');

      // Close all other cards
      cards.forEach(c => c.classList.remove('expanded'));

      // Toggle clicked card
      if (!isExpanded) {
        card.classList.add('expanded');
      }
    });
  });
}

/* ===== SIMPLE REVEAL (services, contact, etc.) ===== */
function initSimpleReveals() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  // Assign stagger index per parent section so siblings animate sequentially
  const parentMap = new Map();
  elements.forEach(el => {
    const parent = el.closest('section') || el.parentElement;
    const count = parentMap.get(parent) || 0;
    el.dataset.revealIndex = count;
    parentMap.set(parent, count + 1);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = (parseInt(entry.target.dataset.revealIndex, 10) || 0) * 120;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach(el => observer.observe(el));
}

/* ===== SMOOTH SCROLL FOR NAV LINKS ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile menu if open
      const navLinks = document.querySelector('.nav__links');
      const hamburger = document.querySelector('.nav__hamburger');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelector('.nav__links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
}

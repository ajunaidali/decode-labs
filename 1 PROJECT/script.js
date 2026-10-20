/* ============================================
   RESPONSIVE ARCHITECTURE — Script
   Vanilla JavaScript for all interactive features
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     Utility: check reduced-motion preference
  ------------------------------------------ */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ------------------------------------------
     1. Copyright Year
  ------------------------------------------ */
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------
     2. Sticky Header
  ------------------------------------------ */
  const header = document.getElementById('site-header');
  const SCROLL_THRESHOLD = 60;

  function handleHeaderScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // run once on load

  /* ------------------------------------------
     3. Mobile Navigation
  ------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  function openMobileMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close mobile menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileMenu();
      hamburger.focus();
    }
  });

  /* ------------------------------------------
     4. Smooth Scroll (fallback for older browsers)
     CSS `scroll-behavior: smooth` handles most cases,
     but we handle hash links explicitly for robustness.
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        // Update URL hash without jump
        history.pushState(null, null, targetId);
      }
    });
  });

  /* ------------------------------------------
     5. Project Category Filtering
  ------------------------------------------ */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.dataset.filter;

      // Update active state and aria-pressed
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      // Show/hide cards
      projectCards.forEach(function (card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ------------------------------------------
     6. Project Detail Modal
  ------------------------------------------ */
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalImg      = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle    = document.getElementById('modal-title');
  const modalDesc     = document.getElementById('modal-desc');
  const modalYear     = document.getElementById('modal-year');
  const modalLocation = document.getElementById('modal-location');
  const modalArea     = document.getElementById('modal-area');
  const modalStatus   = document.getElementById('modal-status');

  let lastFocusedElement = null;

  function openModal(card) {
    lastFocusedElement = document.activeElement;

    // Populate modal data
    const img = card.querySelector('.project-card-image img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalCategory.textContent = card.dataset.category;
    modalTitle.textContent    = card.dataset.title;
    modalDesc.textContent     = card.dataset.desc;
    modalYear.textContent     = card.dataset.year;
    modalLocation.textContent = card.dataset.location;
    modalArea.textContent     = card.dataset.area;
    modalStatus.textContent   = card.dataset.status;

    // Show modal
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    // Focus the close button
    requestAnimationFrame(function () {
      modalCloseBtn.focus();
    });
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');

    // Return focus
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Click on project card
  projectCards.forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card);
    });

    // Keyboard support (Enter / Space)
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // Close modal actions
  modalCloseBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', function (e) {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Trap focus within modal when open
  modalBackdrop.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    if (!modalBackdrop.classList.contains('open')) return;

    const focusable = modalBackdrop.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ------------------------------------------
     7. Testimonials Carousel
  ------------------------------------------ */
  const carouselTrack = document.getElementById('carousel-track');
  const prevBtn       = document.getElementById('carousel-prev');
  const nextBtn       = document.getElementById('carousel-next');
  const dots          = document.querySelectorAll('.carousel-dot');
  const totalSlides   = dots.length;
  let currentSlide    = 0;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    const offset = -currentSlide * 100;
    carouselTrack.style.transform = 'translateX(' + offset + '%)';

    // Update dots
    dots.forEach(function (dot, i) {
      const isActive = i === currentSlide;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  prevBtn.addEventListener('click', function () {
    goToSlide(currentSlide - 1);
  });

  nextBtn.addEventListener('click', function () {
    goToSlide(currentSlide + 1);
  });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goToSlide(parseInt(this.dataset.slide, 10));
    });
  });

  // Keyboard support for carousel
  document.querySelector('.carousel').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      goToSlide(currentSlide - 1);
      prevBtn.focus();
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentSlide + 1);
      nextBtn.focus();
    }
  });

  /* ------------------------------------------
     8. Scroll-Triggered Animations
  ------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-children');

  if (!prefersReducedMotion()) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion, show everything immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ------------------------------------------
     9. Animated Statistics Counter
  ------------------------------------------ */
  const statsGrid = document.getElementById('stats-grid');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    const counters = statsGrid.querySelectorAll('.stat-number');
    counters.forEach(function (counter) {
      const target = parseInt(counter.dataset.target, 10);
      const duration = prefersReducedMotion() ? 0 : 2000; // ms

      if (duration === 0) {
        counter.textContent = target + '+';
        return;
      }

      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(eased * target);

        counter.textContent = currentVal + (progress >= 1 ? '+' : '');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  statsObserver.observe(statsGrid);

  /* ------------------------------------------
     10. Contact Form Validation
  ------------------------------------------ */
  const contactForm   = document.getElementById('contact-form');
  const formFeedback  = document.getElementById('form-feedback');
  const submitBtn     = document.getElementById('form-submit-btn');

  const fields = [
    {
      input: document.getElementById('contact-name'),
      error: document.getElementById('name-error'),
      validate: function (val) { return val.trim().length >= 2; }
    },
    {
      input: document.getElementById('contact-email'),
      error: document.getElementById('email-error'),
      validate: function (val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }
    },
    {
      input: document.getElementById('contact-subject'),
      error: document.getElementById('subject-error'),
      validate: function (val) { return val.trim().length >= 2; }
    },
    {
      input: document.getElementById('contact-message'),
      error: document.getElementById('message-error'),
      validate: function (val) { return val.trim().length >= 10; }
    }
  ];

  // Real-time validation on blur
  fields.forEach(function (field) {
    field.input.addEventListener('blur', function () {
      validateField(field);
    });

    // Clear error on input
    field.input.addEventListener('input', function () {
      if (field.input.classList.contains('error')) {
        field.input.classList.remove('error');
        field.error.classList.remove('visible');
      }
    });
  });

  function validateField(field) {
    const isValid = field.validate(field.input.value);
    field.input.classList.toggle('error', !isValid);
    field.error.classList.toggle('visible', !isValid);
    return isValid;
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      formFeedback.textContent = 'Please correct the errors above before submitting.';
      formFeedback.className = 'form-feedback error-msg';
      return;
    }

    // Demo submission — simulate processing
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(function () {
      formFeedback.textContent =
        'Demo submission received! In a production environment, this form would send your message to the server. Thank you for testing.';
      formFeedback.className = 'form-feedback success';
      submitBtn.textContent = 'Send Message (Demo)';
      submitBtn.disabled = false;
      contactForm.reset();

      // Clear any lingering error styles
      fields.forEach(function (field) {
        field.input.classList.remove('error');
        field.error.classList.remove('visible');
      });
    }, 1200);
  });

  /* ------------------------------------------
     11. Back-to-Top Button
  ------------------------------------------ */
  const backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  });

  /* ------------------------------------------
     12. Graceful Image Error Handling
  ------------------------------------------ */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      // Replace broken image with a styled placeholder
      this.style.backgroundColor = '#E7E5E0';
      this.style.minHeight = '200px';
      this.alt = 'Image unavailable — ' + (this.alt || 'architectural photograph');
    });
  });

})();

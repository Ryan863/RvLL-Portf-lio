/**
 * RvLL.Dev — Interactive Behaviors & GSAP Animations
 * Direction: NOVASITE Inspired High-Performance Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  initVideoAutoplay();
  initMobileNav();
  initSpotlightHover();
  initLightbox();
  initGSAPAnimations();
  initActiveNavOnScroll();
});

/* --------------------------------------------------------------------------
   1. Video Autoplay Assurance & Fallback
   -------------------------------------------------------------------------- */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Autoplay policy prevented playback, ensure muted & retry on interaction
        console.warn('Video autoplay deferred:', error);
        const retryPlay = () => {
          video.play();
          window.removeEventListener('click', retryPlay);
          window.removeEventListener('touchstart', retryPlay);
        };
        window.addEventListener('click', retryPlay, { once: true });
        window.addEventListener('touchstart', retryPlay, { once: true });
      });
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isActive = drawer.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    toggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  }

  toggleBtn.addEventListener('click', toggleMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   3. 21st.dev Interactive Spotlight Card Hover Effect
   -------------------------------------------------------------------------- */
function initSpotlightHover() {
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--mouse-opacity', '1');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-opacity', '0');
    });
  });
}

/* --------------------------------------------------------------------------
   4. Lightbox for Real Testimonial Image (Édipo - EDI)
   -------------------------------------------------------------------------- */
function initLightbox() {
  const trigger = document.getElementById('open-feedback-lightbox');
  const modal = document.getElementById('feedback-lightbox-modal');
  const closeBtn = document.getElementById('close-feedback-lightbox');

  if (!trigger || !modal || !closeBtn) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. GSAP & ScrollTrigger Animations
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded. Fallback to native CSS transitions.');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Floating Pill Nav Entrance
  gsap.from('.floating-pill-nav', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.2
  });

  // Hero Central Value Block Reveal
  gsap.from('.hero-central-block', {
    y: 35,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.35
  });

  // Hero Massive Title ("RvLL.Dev") Bridge Animation
  gsap.from('.hero-massive-title', {
    y: 40,
    opacity: 0,
    duration: 1.1,
    ease: 'power4.out',
    delay: 0.55
  });

  if (typeof ScrollTrigger === 'undefined') return;

  // About Section Typography Reveal
  gsap.from('.about-statement', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  // About Info Cards
  gsap.from('.about-info-card', {
    scrollTrigger: {
      trigger: '.about-details-row',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Benefits Section Staggered Reveal
  gsap.from('.benefit-card', {
    scrollTrigger: {
      trigger: '.benefits-grid',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.85,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // FAQ Items Staggered Reveal
  gsap.from('.faq-item', {
    scrollTrigger: {
      trigger: '.faq-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Pricing Cards Reveal
  gsap.from('.pricing-card-wrap', {
    scrollTrigger: {
      trigger: '.pricing-grid',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Portfolio Grid Reveal
  gsap.from('.portfolio-card', {
    scrollTrigger: {
      trigger: '.portfolio-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Testimonial Banner Reveal
  gsap.from('.testimonial-feature-block', {
    scrollTrigger: {
      trigger: '.testimonial-feature-block',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    scale: 0.96,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  // Contact Banner Reveal
  gsap.from('.contact-card-banner', {
    scrollTrigger: {
      trigger: '.contact-card-banner',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  });
}

/* --------------------------------------------------------------------------
   6. Active Nav Link on Scroll
   -------------------------------------------------------------------------- */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

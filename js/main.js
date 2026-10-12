/**
 * RvLL.Dev — Interactive Behaviors & GSAP Animations
 * Direction: NOVASITE Inspired High-Performance Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  initVideoAutoplay();
  initMobileNav();
  initSpotlightHover();
  initFAQAccordion();
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
   3.5. Interactive FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const accordionItems = document.querySelectorAll('.faq-accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.faq-accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros itens para comportamento de acordeão limpo
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-accordion-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Alterna o estado do item clicado
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
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
    
    // Atualiza cálculos do ScrollTrigger dinamicamente em qualquer alteração de zoom ou resize
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }

  // Floating Pill Nav: mantido estável via CSS sem deslocamento destrutivo de transform
  // Hero Elements: animações sutis de entrada com limpeza imediata de propriedades (clearProps)
  gsap.from('.hero-central-block', {
    y: 15,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.1,
    clearProps: 'transform'
  });

  gsap.from('.hero-massive-title', {
    y: 15,
    duration: 0.9,
    ease: 'power2.out',
    delay: 0.2,
    clearProps: 'transform'
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

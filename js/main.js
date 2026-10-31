/**
 * RvLL.Dev — Interactive Behaviors & GSAP Animations
 * Direction: NOVASITE Inspired High-Performance Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  updateAppHeight();
  initVideoAutoplay();
  initMobileNav();
  initSpotlightHover();
  initProposalSelector();
  initFAQAccordion();
  initLightbox();
  initGSAPAnimations();
  initActiveNavOnScroll();
});

function updateAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}
window.addEventListener('resize', updateAppHeight, { passive: true });
window.addEventListener('orientationchange', updateAppHeight, { passive: true });

/* --------------------------------------------------------------------------
   1. Video Autoplay Assurance & Responsive Video Sync (Mobile / Desktop)
   -------------------------------------------------------------------------- */
function initVideoAutoplay() {
  const mobileVideo = document.getElementById('hero-video-mobile');
  const desktopVideo = document.getElementById('hero-video-desktop');

  function syncActiveVideo() {
    const isMobile = window.innerWidth <= 768;
    const activeVideo = isMobile ? mobileVideo : desktopVideo;
    const inactiveVideo = isMobile ? desktopVideo : mobileVideo;

    if (inactiveVideo && !inactiveVideo.paused) {
      inactiveVideo.pause();
    }

    if (activeVideo) {
      activeVideo.muted = true;
      const playPromise = activeVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Video autoplay deferred:', error);
          const retryPlay = () => {
            activeVideo.play().catch(() => {});
            window.removeEventListener('click', retryPlay);
            window.removeEventListener('touchstart', retryPlay);
          };
          window.addEventListener('click', retryPlay, { once: true });
          window.addEventListener('touchstart', retryPlay, { once: true });
        });
      }
    }
  }

  syncActiveVideo();
  window.addEventListener('resize', syncActiveVideo, { passive: true });
  window.addEventListener('orientationchange', syncActiveVideo, { passive: true });
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
   3.4. Interactive Proposal Type Selector (WhatsApp Auto-Configurator)
   -------------------------------------------------------------------------- */
function initProposalSelector() {
  const chips = document.querySelectorAll('.proposal-chip');
  const ctaBtn = document.getElementById('proposal-whatsapp-btn');
  if (!chips.length || !ctaBtn) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const customMsg = chip.getAttribute('data-msg');
      if (customMsg) {
        ctaBtn.href = `https://wa.me/5549999708745?text=${customMsg}`;
      }

      // Micro-animação tátil de clique
      ctaBtn.style.transform = 'scale(0.98)';
      setTimeout(() => {
        ctaBtn.style.transform = '';
      }, 150);
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
   5. GSAP & ScrollTrigger Animations (Zero Pinning, Free Native Scroll)
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded. Fallback to native CSS transitions.');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Configuração de compatibilidade total para dispositivos móveis
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });

    // Mobile: rolagem 100% livre e limpa sem pinning ou scroll-jacking
    ScrollTrigger.matchMedia({
      // Desktop: animações sutis de entrada
      "(min-width: 769px)": function() {
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
      },

      // Mobile: apenas fade-in sem qualquer interferência de scroll
      "(max-width: 768px)": function() {
        gsap.from('.hero-central-block', {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }
    });

    // Recalcula após carregamento total de fontes e imagens
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

    // Atualiza cálculos do ScrollTrigger dinamicamente em qualquer alteração de zoom ou resize
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  } else {
    // Fallback sem ScrollTrigger
    gsap.from('.hero-central-block', {
      y: 15,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.1,
      clearProps: 'transform'
    });
  }
}

/* --------------------------------------------------------------------------
   6. Active Nav Link on Scroll (Throttled & Passive)
   -------------------------------------------------------------------------- */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item a');
  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
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

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

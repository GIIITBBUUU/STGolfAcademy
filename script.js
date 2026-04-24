/* =========================================
   TASHKENT GOLF ACADEMY — script.js
   ========================================= */

'use strict';

// ---------- State ----------
let currentLang = 'en';
let translations = {};

// ---------- Load Translations ----------
async function loadTranslations() {
  try {
    const res = await fetch('translations.json');
    translations = await res.json();
    applyTranslations(currentLang);
  } catch (err) {
    console.warn('Could not load translations.json. Make sure it is in the same folder.');
  }
}

// ---------- Apply Language ----------
function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Handle placeholder attributes if needed
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  // Update active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang;
  currentLang = lang;
}

// ---------- Header Scroll ----------
function initHeaderScroll() {
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- Intersection Observer (Fade-in) ----------
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Staggered children
        const children = entry.target.querySelectorAll('.fade-child');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 120);
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ---------- Language Switcher ----------
function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      applyTranslations(lang);
    });
  });
}

// ---------- Mobile Nav ----------
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  if (!hamburger || !nav) return;

  const closeBtn = document.createElement('span');
  closeBtn.textContent = '✕';
  closeBtn.className = 'close-btn';
  nav.appendChild(closeBtn);

  hamburger.addEventListener('click', () => {
    nav.classList.add('mobile-open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    nav.classList.remove('mobile-open');
    document.body.style.overflow = '';
  });

  // Close when a nav link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });
}

// ---------- Smooth CTA Scroll ----------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---------- Gallery Hover Cursor ----------
function initGalleryEffect() {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '2';
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '';
    });
  });
}

// ---------- Pricing Card Highlight ----------
function initPricingHover() {
  document.querySelectorAll('.plan-card:not(.featured)').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.background = 'var(--green-deep)';
      card.querySelectorAll('.plan-name, .plan-price, .plan-desc, .plan-feature, .plan-period').forEach(el => {
        el.style.color = 'rgba(255,255,255,0.85)';
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
      card.querySelectorAll('.plan-name, .plan-price, .plan-desc, .plan-feature, .plan-period').forEach(el => {
        el.style.color = '';
      });
    });
  });
}

// ---------- Stagger Fade-children setup ----------
function initFadeChildren() {
  document.querySelectorAll('.fade-child').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  // Override visible class for children
  const style = document.createElement('style');
  style.textContent = '.fade-child.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', async () => {
  await loadTranslations();
  initHeaderScroll();
  initFadeIn();
  initFadeChildren();
  initLangSwitcher();
  initMobileNav();
  initSmoothScroll();
  initCounters();
  initGalleryEffect();
  initPricingHover();
});

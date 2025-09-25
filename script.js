// Smooth year update (guarded if element exists)
(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

// Carousel logic
const carousel = document.querySelector('[data-carousel]');
const viewport = document.querySelector('[data-viewport]');
const track = document.querySelector('[data-track]');
const prevBtn = document.querySelector('[data-prev]');
const nextBtn = document.querySelector('[data-next]');
const progressBar = document.querySelector('[data-progress]');

if (carousel && viewport && track) {
  const getCardWidth = () => {
    const firstCard = track.querySelector('.card');
    if (!firstCard) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '16');
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollByCards = (count) => {
    const distance = getCardWidth() * count;
    viewport.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - viewport.clientWidth;
    const current = viewport.scrollLeft;
    prevBtn.disabled = current <= 1;
    nextBtn.disabled = current >= maxScroll - 1;
  };

  const updateProgress = () => {
    const maxScroll = track.scrollWidth - viewport.clientWidth;
    const current = viewport.scrollLeft;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, current / maxScroll)) : 0;
    progressBar.style.width = `${ratio * 100}%`;
  };

  prevBtn?.addEventListener('click', () => scrollByCards(-1));
  nextBtn?.addEventListener('click', () => scrollByCards(1));
  viewport.addEventListener('scroll', () => { updateButtons(); updateProgress(); });
  window.addEventListener('resize', () => { updateButtons(); updateProgress(); });

  // Initialize
  updateButtons();
  updateProgress();
}

// Scroll reveal via IntersectionObserver
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  elements.forEach(el => observer.observe(el));
})();

// Mobile drawer logic
(() => {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn = drawer?.querySelector('.drawer-close');
  const brand = document.querySelector('.brand');
  if (!drawer || !overlay || !brand) return;

  const isMobile = () => window.matchMedia('(max-width: 680px)').matches;

  const openDrawer = () => {
    if (!isMobile()) return;
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Open by tapping the brand logo on mobile
  brand.addEventListener('click', (e) => {
    if (!isMobile()) return;
    e.preventDefault();
    openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element && target.tagName === 'A') {
      closeDrawer();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Swipe gestures
  let startX = 0;
  let currentX = 0;
  let dragging = false;
  const EDGE = 24; // px from left edge to begin opening gesture

  const onTouchStart = (e) => {
    if (!isMobile()) return;
    const touch = e.touches?.[0] || e;
    startX = touch.clientX;
    currentX = startX;
    // Allow open gesture only from left edge when closed
    if (!drawer.classList.contains('is-open') && startX <= EDGE) {
      dragging = true;
      drawer.style.transition = 'none';
      overlay.style.transition = 'none';
    }
    // Allow close gesture when starting inside open drawer
    if (drawer.classList.contains('is-open') && startX <= drawer.offsetWidth + 20) {
      dragging = true;
      drawer.style.transition = 'none';
      overlay.style.transition = 'none';
    }
  };

  const onTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches?.[0] || e;
    currentX = touch.clientX;
    const delta = Math.min(Math.max(currentX - startX, -drawer.offsetWidth), drawer.offsetWidth);
    if (drawer.classList.contains('is-open')) {
      const translate = Math.max(-drawer.offsetWidth, Math.min(0, delta));
      drawer.style.transform = `translateX(${translate}px)`;
      const alpha = 1 - Math.min(1, Math.max(0, Math.abs(translate) / drawer.offsetWidth));
      overlay.style.opacity = String(0.46 * alpha);
    } else {
      const translate = Math.min(0, -drawer.offsetWidth + Math.max(0, currentX));
      drawer.style.transform = `translateX(${translate}px)`;
      const alpha = 1 - Math.min(1, Math.max(0, Math.abs(translate) / drawer.offsetWidth));
      overlay.style.opacity = String(0.46 * alpha);
      overlay.classList.add('is-open');
    }
  };

  const onTouchEnd = () => {
    if (!dragging) return;
    dragging = false;
    drawer.style.transition = '';
    overlay.style.transition = '';
    const moved = currentX - startX;
    const threshold = drawer.offsetWidth * 0.33;
    if (drawer.classList.contains('is-open')) {
      if (moved < -threshold) {
        closeDrawer();
      } else {
        openDrawer();
      }
    } else {
      if (moved > threshold) {
        openDrawer();
      } else {
        closeDrawer();
      }
    }
    drawer.style.transform = '';
  };

  // Touch events on window and drawer for better capture
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd);
})();

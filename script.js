// Smooth year update
document.getElementById('year').textContent = new Date().getFullYear();

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



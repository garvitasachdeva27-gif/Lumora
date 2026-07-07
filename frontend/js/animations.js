// Staggered scroll/load reveal for any element with class="reveal"
// Add data-stagger="N" to a parent to delay each child by N*80ms automatically.

function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el, i) => {
    const parent = el.closest('[data-stagger]');
    if (parent) {
      const delay = i * 80;
      el.style.transitionDelay = `${delay}ms`;
    }
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initReveal);
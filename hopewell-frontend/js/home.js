// ===== HOME PAGE INTERACTIONS =====

// Scroll-triggered reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animate progress bars when they scroll into view
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const target = fill.style.getPropertyValue('--target-width') || '0%';
      fill.style.width = target;
      progressObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.cause-progress-fill').forEach(el => progressObserver.observe(el));

const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)');
const proximity = 80;
const maxOffset = 12;
const items = [...document.querySelectorAll('[data-parallax]')];
const clamp = value => Math.max(-1, Math.min(1, value));

function resetParallax() {
  items.forEach(item => { item.style.translate = '0px 0px'; });
}

function updatePointer(event) {
  if (!motionAllowed.matches || event.pointerType === 'touch') return resetParallax();
  let nearest = null;
  let nearestDistance = Infinity;
  // Use unshifted bounds so movement cannot feed back into hit testing.
  for (const item of items) {
    const rect = item.getBoundingClientRect();
    const translation = getComputedStyle(item).translate.split(' ').map(parseFloat);
    const left = rect.left - (translation[0] || 0);
    const top = rect.top - (translation[1] || 0);
    const dx = event.clientX - (left + rect.width / 2);
    const dy = event.clientY - (top + rect.height / 2);
    const distance = Math.hypot(Math.max(0, Math.abs(dx) - rect.width / 2), Math.max(0, Math.abs(dy) - rect.height / 2));
    if (distance < proximity && distance < nearestDistance) {
      nearestDistance = distance;
      nearest = { item, dx, dy, width: rect.width, height: rect.height };
    }
  }
  items.forEach(item => {
    let x = 0;
    let y = 0;
    if (nearest && nearest.item === item) {
      const strength = 1 - nearestDistance / proximity;
      const direction = Math.sign(Number(item.dataset.parallax)) || 1;
      x = clamp(nearest.dx / (nearest.width / 2)) * maxOffset * strength * direction;
      y = clamp(nearest.dy / (nearest.height / 2)) * maxOffset * strength * direction;
    }
    item.style.translate = `${x}px ${y}px`;
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (!motionAllowed.matches || event.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -18;
    card.style.transform = `perspective(720px) rotateX(${y}deg) rotateY(${x}deg) translateY(-16px) scale(1.025)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});
window.addEventListener('pointermove', updatePointer);
document.documentElement.addEventListener('pointerleave', resetParallax);
window.addEventListener('blur', resetParallax);
window.addEventListener('scroll', resetParallax, { passive: true });
window.addEventListener('resize', resetParallax);
motionAllowed.addEventListener('change', () => {
  resetParallax();
  document.querySelectorAll('.project-card').forEach(card => { card.style.transform = ''; });
});


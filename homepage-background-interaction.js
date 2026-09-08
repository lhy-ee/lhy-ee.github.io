(() => {
  const hit = document.querySelector('.homepage-background-hit');
  const mask = document.querySelector('.homepage-mask-hover');
  const allowed = matchMedia('(hover: hover) and (pointer: fine)');
  if (!hit || !mask) return;

  function apply(transform) {
    hit.style.transform = transform;
    mask.style.transform = transform;
  }

  function reset() {
    apply('');
  }

  hit.addEventListener('pointermove', event => {
    if (!allowed.matches || event.pointerType === 'touch') return reset();
    const rect = hit.ownerSVGElement.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    const x = nx * 12;
    const y = -10 + ny * 8;
    const angle = nx * 3;
    apply(`translate(${x}px, ${y}px) rotate(${angle}deg)`);
  });

  hit.addEventListener('pointerleave', reset);
  addEventListener('blur', reset);
  addEventListener('scroll', reset, { passive: true });
  allowed.addEventListener('change', reset);
})();

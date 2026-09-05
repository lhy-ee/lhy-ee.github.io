(() => {
  const work = document.querySelector('#work');
  const cards = [...document.querySelectorAll('.project-card')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  function render() {
    scheduled = false;
    if (reducedMotion.matches) {
      cards.forEach(card => { card.style.opacity = '1'; card.style.translate = '0 0'; });
      return;
    }
    const rect = work.getBoundingClientRect();
    const viewport = innerHeight;
    const baseEnter = clamp((viewport - rect.top) / (viewport * 0.72));
    const exit = clamp((viewport * 0.72 - rect.bottom) / (viewport * 0.48));
    cards.forEach((card, index) => {
      const rowDelay = index < 3 ? 0 : 0.2;
      const columnDelay = (index % 3) * 0.06;
      const enter = clamp((baseEnter - rowDelay - columnDelay) / 0.62);
      const opacity = enter * (1 - exit);
      const x = -140 * (1 - enter) - 150 * exit;
      card.style.opacity = String(opacity);
      card.style.translate = `${x}px 0`;
      card.style.pointerEvents = opacity > 0.85 ? 'auto' : 'none';
    });
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(render); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', schedule);
  render();
})();

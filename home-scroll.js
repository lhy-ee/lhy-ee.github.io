(() => {
  const scene = document.querySelector('.home-scroll-scene');
  const hero = scene?.querySelector('.hero');
  if (!hero) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  function render() {
    pending = false;
    const distance = scene.offsetHeight - hero.offsetHeight;
    const progress = reduced.matches || distance <= 0 ? 0 :
      Math.max(0, Math.min(1, -scene.getBoundingClientRect().top / distance));
    const scale = 1 + progress * 2;
    scene.style.setProperty('--home-scroll-scale', String(scale));
    scene.style.setProperty('--home-scroll-opacity', String(Math.max(0, Math.min(1, 3 - scale))));
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(render); }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href="#home"]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== '#home') history.pushState(null, '', '#home');
    window.scrollTo({
      top: window.scrollY + scene.getBoundingClientRect().top,
      behavior: reduced.matches ? 'instant' : 'smooth'
    });
    schedule();
  });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', schedule);
  reduced.addEventListener('change', schedule);
  render();
})();



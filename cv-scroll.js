(() => {
  const section = document.querySelector('#cv');
  const sheet = document.querySelector('.cv-sheet');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  function render() {
    scheduled = false;
    const viewport = window.innerHeight;
    const end = Math.min(180, viewport * 0.25);
    const top = section.getBoundingClientRect().top;
    const enter = Math.max(0, Math.min(1, (viewport - top) / (viewport - end)));
    const sectionBottom = section.getBoundingClientRect().bottom;
    const exit = Math.max(0, Math.min(1, (viewport * 0.78 - sectionBottom) / (viewport * 0.55)));
    const progress = reducedMotion.matches ? 1 : enter;
    const travel = Math.min(260, window.innerWidth * 0.3);
    // The upper edge leads; the lower edge starts after 25% of the scroll.
    const upperProgress = Math.min(1, progress / 0.75);
    const lowerProgress = Math.max(0, (progress - 0.25) / 0.75);
    const upperX = -travel * (1 - upperProgress);
    const lowerX = -travel * (1 - lowerProgress);
    const shear = (lowerX - upperX) / Math.max(1, sheet.offsetHeight);
    sheet.style.opacity = String(progress * (1 - exit));
    sheet.style.transformOrigin = '0 0';
    sheet.style.transform = `matrix(1, 0, ${shear}, 1, ${upperX - exit * travel}, 0)`;
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(render);
    }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', schedule);
  render();
})();



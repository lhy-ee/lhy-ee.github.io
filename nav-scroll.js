(() => {
  const bar = document.querySelector('.topbar');
  const cv = document.querySelector('#cv');
  let scheduled = false;
  function render() {
    scheduled = false;
    const cvTop = cv.getBoundingClientRect().top;
    const distance = Math.max(0, -cvTop);
    const fadeDistance = Math.min(360, innerHeight * 0.45);
    const progress = Math.max(0, Math.min(1, distance / fadeDistance));
    bar.classList.toggle('has-backdrop', progress > 0);
    bar.style.setProperty('--nav-backdrop-opacity', progress.toFixed(3));
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(render); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', schedule);
  render();
})();

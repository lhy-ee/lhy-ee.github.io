(() => {
  const bar = document.querySelector('.topbar');
  const home = document.querySelector('#home');
  let scheduled = false;
  function render() {
    scheduled = false;
    const homeTop = home.getBoundingClientRect().top;
    const distance = Math.max(0, -homeTop);
    const fadeDistance = Math.min(320, innerHeight * 0.42);
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

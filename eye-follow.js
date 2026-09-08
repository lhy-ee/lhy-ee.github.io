(() => {
  const character = document.querySelector('.eye-character');
  const pupils = [...document.querySelectorAll('.eye-pupil')];
  const maxX = 10;
  const maxUp = 4;
  const maxDown = 8;
  if (!character || pupils.length === 0) return;

  function moveEyes(event) {
    const rect = character.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height * 0.42);
    const length = Math.max(1, Math.hypot(dx, dy));
    const strength = Math.min(1, length / 420);
    const x = dx / length * maxX * strength;
    const verticalLimit = dy < 0 ? maxUp : maxDown;
    const y = dy / length * verticalLimit * strength;
    pupils.forEach(pupil => { pupil.style.translate = `${x}px ${y}px`; });
  }

  function resetEyes() {
    pupils.forEach(pupil => { pupil.style.translate = '0 0'; });
  }

  window.addEventListener('pointermove', moveEyes);
  window.addEventListener('blur', resetEyes);
  document.documentElement.addEventListener('pointerleave', resetEyes);
})();


(() => {
  const character = document.querySelector('.eye-character');
  const pupils = [...document.querySelectorAll('.eye-pupil')];
  const maxX = 30;
  const maxUp = 10;
  const maxDown = 22;
  const smoothing = 0.16;
  if (!character || pupils.length === 0) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;

  function render() {
    currentX += (targetX - currentX) * smoothing;
    currentY += (targetY - currentY) * smoothing;

    if (Math.abs(targetX - currentX) < 0.01) currentX = targetX;
    if (Math.abs(targetY - currentY) < 0.01) currentY = targetY;

    const transform = `translate(${currentX.toFixed(2)} ${currentY.toFixed(2)})`;
    pupils.forEach(pupil => pupil.setAttribute('transform', transform));

    if (currentX !== targetX || currentY !== targetY) {
      frame = requestAnimationFrame(render);
    } else {
      frame = 0;
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function moveEyes(event) {
    const rect = character.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height * 0.42);
    const length = Math.max(1, Math.hypot(dx, dy));
    const strength = Math.min(1, length / 420);
    targetX = dx / length * maxX * strength;
    targetY = dy / length * (dy < 0 ? maxUp : maxDown) * strength;
    schedule();
  }

  function resetEyes() {
    targetX = 0;
    targetY = 0;
    schedule();
  }

  window.addEventListener('pointermove', moveEyes, { passive: true });
  window.addEventListener('blur', resetEyes);
  document.documentElement.addEventListener('pointerleave', resetEyes);
})();
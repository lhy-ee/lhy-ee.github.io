(() => {
  const assets = [
    '03-pink-spark.png',
    '04-long-starburst.png',
    'sticker-26.png'
  ];

  function random(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function makeSticker(file, x, y, size, angle, delay, opacity = 1) {
    const img = new Image();
    img.src = `assets/stikers/${file}`;
    img.alt = '';
    img.className = 'random-page-sticker';
    img.style.setProperty('--sticker-x', `${x}%`);
    img.style.setProperty('--sticker-y', `${y}%`);
    img.style.setProperty('--sticker-size', `${size}px`);
    img.style.setProperty('--sticker-angle', `${angle}deg`);
    img.style.setProperty('--sticker-delay', `${delay}s`);
    img.style.setProperty('--sticker-opacity', opacity);
    return img;
  }

  function fillHome() {
    const hero = document.querySelector('#home');
    if (!hero) return;
    const rand = Math.random;
    const width = innerWidth;
    const count = width < 600 ? 36 : width < 1000 ? 53 : 65;
    const minDistance = width < 600 ? 12 : 8;
    const points = [];
    let attempts = 0;
    while (points.length < count && attempts < count * 120) {
      attempts++;
      const point = { x: 3 + rand() * 94, y: 15 + rand() * 80 };
      const clear = points.every(other => {
        const dx = point.x - other.x;
        const dy = (point.y - other.y) * 1.15;
        return Math.hypot(dx, dy) >= minDistance;
      });
      if (clear) points.push(point);
    }
    const layer = document.createElement('div');
    layer.className = 'random-sticker-layer home-random-stickers';
    for (let i = 0; i < count; i++) {
      const point = points[i] || { x: 3 + rand() * 94, y: 15 + rand() * 80 };
      const size = width < 600 ? 15 : 22;
      layer.appendChild(makeSticker(
        assets[Math.floor(rand() * assets.length)],
        point.x,
        point.y,
        size,
        -28 + rand() * 56,
        -rand() * 8
      ));
    }
    hero.prepend(layer);
  }


  fillHome();

  const stickers = [...document.querySelectorAll('.random-page-sticker')];
  const layer = document.querySelector('.home-random-stickers');
  const motion = new WeakMap();
  const pointer = { x: 0, y: 0, active: false };
  const radius = 82;
  const maxDistance = 42;
  let frame = 0;

  stickers.forEach((sticker, index) => {
    const angle = index * 2.399;
    motion.set(sticker, {
      x: 0, y: 0,
      dirX: Math.cos(angle), dirY: Math.sin(angle)
    });
  });

  function animateRepulsion() {
    frame = 0;
    if (!layer) return;
    const layerRect = layer.getBoundingClientRect();
    let moving = false;

    stickers.forEach(sticker => {
      const state = motion.get(sticker);
      const xPercent = parseFloat(sticker.style.getPropertyValue('--sticker-x'));
      const yPercent = parseFloat(sticker.style.getPropertyValue('--sticker-y'));
      const centerX = layerRect.left + layerRect.width * xPercent / 100;
      const centerY = layerRect.top + layerRect.height * yPercent / 100;
      const dx = centerX - pointer.x;
      const dy = centerY - pointer.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 7) {
        state.dirX = dx / distance;
        state.dirY = dy / distance;
      }
      const strength = pointer.active ? Math.max(0, 1 - distance / radius) : 0;
      const offset = maxDistance * strength * strength;
      const targetX = state.dirX * offset;
      const targetY = state.dirY * offset;
      state.x += (targetX - state.x) * 0.16;
      state.y += (targetY - state.y) * 0.16;
      if (Math.abs(targetX - state.x) > 0.05 || Math.abs(targetY - state.y) > 0.05) moving = true;
      sticker.style.setProperty('--evade-x', `${state.x.toFixed(2)}px`);
      sticker.style.setProperty('--evade-y', `${state.y.toFixed(2)}px`);
    });

    if (moving) frame = requestAnimationFrame(animateRepulsion);
  }

  function scheduleRepulsion() {
    if (!frame) frame = requestAnimationFrame(animateRepulsion);
  }

  if (matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      scheduleRepulsion();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => {
      pointer.active = false;
      scheduleRepulsion();
    });
    addEventListener('scroll', scheduleRepulsion, { passive: true });
    addEventListener('resize', scheduleRepulsion);
  }
})();













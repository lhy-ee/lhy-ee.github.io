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
    const count = width < 600 ? 24 : width < 1000 ? 35 : 43;
    const minDistance = width < 600 ? 16 : 10;
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
})();










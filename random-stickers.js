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
    const count = width < 600 ? 12 : width < 1000 ? 17 : 21;
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
      const size = width < 600 ? 22.67 + rand() * 15.33 : 30 + rand() * 28.5;
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

  function fillCv() {
    const cv = document.querySelector('#cv');
    if (!cv) return;
    const rand = Math.random;
    const count = innerWidth < 600 ? 5 : 8;
    const layer = document.createElement('div');
    layer.className = 'random-sticker-layer cv-random-stickers';
    for (let i = 0; i < count; i++) {
      const progress = count === 1 ? 0 : i / (count - 1);
      const y = 3 + Math.pow(rand(), 1.8) * 60;
      const x = 5 + rand() * 90;
      const size = (innerWidth < 600 ? 20 : 26.67) + rand() * (innerWidth < 600 ? 10 : 19.33);
      const opacity = 0.78 - progress * 0.6;
      layer.appendChild(makeSticker(assets[Math.floor(rand() * assets.length)], x, y, size, -24 + rand() * 48, -rand() * 8, opacity));
    }
    cv.prepend(layer);
  }

  fillHome();
  fillCv();
})();






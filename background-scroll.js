(() => {
  const background = document.querySelector('.home-background');
  if (!background) return;
  function layout() {
    const width = background.clientWidth;
    const height = background.clientHeight;
    if (!width || !height) return;
    // Minimum tile width keeps artwork readable on phones.
    const handWidth = Math.max(720, width);
    const welcomeWidth = handWidth * 0.4;
    const rows = [
      { name: 'handdraw-strip', width: handWidth, height: handWidth * 492 / 2901 },
      { name: 'welcome-strip', width: welcomeWidth, height: welcomeWidth * 903 / 6192 }
    ];
    const count = Math.ceil(height / (rows[0].height + rows[1].height)) * 2;
    while (background.children.length > count) background.lastElementChild.remove();
    for (let i = 0; i < count; i++) {
      const spec = rows[i % 2];
      let row = background.children[i];
      if (!row) {
        row = document.createElement('div');
        background.appendChild(row);
      }
      row.className = 'background-strip ' + spec.name;
      row.style.setProperty('--tile-width', spec.width + 'px');
      row.style.setProperty('--row-height', spec.height + 'px');
    }
  }
  layout();
  new ResizeObserver(layout).observe(background);
})();

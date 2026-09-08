(() => {
  const storageKey = 'portfolio-sticker-layout-v5-character-anchor';
  const body = document.body;
  const canvas = document.querySelector('.home-stickers');
  const panel = document.querySelector('#sticker-editor');
  const status = document.querySelector('#editor-status');
  const fileInput = document.querySelector('#sticker-file');
  const sizeControl = document.querySelector('#sticker-size');
  const rotateControl = document.querySelector('#sticker-rotate');
  if (!canvas || !panel || !fileInput) return;

  let selected = null;
  let drag = null;
  let nextId = 1;

  function stickers() {
    return [...canvas.querySelectorAll('.cover-sticker')];
  }

  function ensureIds() {
    stickers().forEach(sticker => {
      if (!sticker.dataset.stickerId) sticker.dataset.stickerId = `sticker-${nextId++}`;
      sticker.draggable = false;
    });
  }

  function setStatus(message) {
    status.textContent = message;
  }

  function select(sticker) {
    selected?.classList.remove('is-selected');
    selected = sticker || null;
    selected?.classList.add('is-selected');
    setStatus(selected ? selected.src.split('/').pop() : 'Select a sticker');
    sizeControl.disabled = !selected;
    rotateControl.disabled = !selected;
    if (selected) {
      sizeControl.value = Math.round(parseFloat(getComputedStyle(selected).width));
      rotateControl.value = Math.round(parseFloat(getComputedStyle(selected).rotate) || 0);
    }
  }

  function scaleWidth(sticker) {
    if (sticker.style.width.endsWith('px')) {
      sticker.style.width = (parseFloat(sticker.style.width) / 880 * 100) + '%';
    }
  }

  function normalize(sticker) {
    scaleWidth(sticker);
    if (getComputedStyle(sticker).display === 'none') return;
    if (sticker.dataset.editorReady === 'true' && sticker.style.left.endsWith('%') && sticker.style.top.endsWith('%')) return;
    const canvasRect = canvas.getBoundingClientRect();
    const rect = sticker.getBoundingClientRect();
    const rotation = parseFloat(getComputedStyle(sticker).rotate) || 0;
    sticker.style.left = `${((rect.left - canvasRect.left) / canvasRect.width) * 100}%`;
    sticker.style.top = `${((rect.top - canvasRect.top) / canvasRect.height) * 100}%`;
    sticker.style.right = 'auto';
    sticker.style.bottom = 'auto';
    sticker.style.width = (parseFloat(getComputedStyle(sticker).width) / canvas.clientWidth * 100) + '%';
    sticker.style.height = 'auto';
    sticker.style.rotate = `${rotation}deg`;
    sticker.dataset.editorReady = 'true';
  }

  function enterEditor() {
    body.classList.add('sticker-editing');
    panel.setAttribute('aria-hidden', 'false');
    ensureIds();
    requestAnimationFrame(() => stickers().forEach(normalize));
    setStatus('Select a sticker');
  }

  function leaveEditor() {
    select(null);
    body.classList.remove('sticker-editing');
    panel.setAttribute('aria-hidden', 'true');
  }

  function toggleEditor() {
    body.classList.contains('sticker-editing') ? leaveEditor() : enterEditor();
  }

  function clampSticker() {
    // Stickers may extend beyond the character anchor.
  }

  canvas.addEventListener('pointerdown', event => {
    if (!body.classList.contains('sticker-editing')) return;
    const sticker = event.target.closest('.cover-sticker');
    if (!sticker) return;
    normalize(sticker);
    select(sticker);
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: sticker.getBoundingClientRect().left - canvas.getBoundingClientRect().left,
      top: sticker.getBoundingClientRect().top - canvas.getBoundingClientRect().top
    };
    sticker.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  canvas.addEventListener('pointermove', event => {
    if (!drag || !selected || event.pointerId !== drag.id) return;
    selected.style.left = `${((drag.left + event.clientX - drag.x) / canvas.clientWidth) * 100}%`;
    selected.style.top = `${((drag.top + event.clientY - drag.y) / canvas.clientHeight) * 100}%`;
    clampSticker(selected);
  });

  canvas.addEventListener('pointerup', event => {
    if (drag && event.pointerId === drag.id) drag = null;
  });

  canvas.addEventListener('wheel', event => {
    if (!body.classList.contains('sticker-editing')) return;
    const sticker = event.target.closest('.cover-sticker');
    if (!sticker) return;
    normalize(sticker);
    select(sticker);
    if (event.shiftKey) {
      const angle = (parseFloat(sticker.style.rotate) || 0) + (event.deltaY < 0 ? 1 : -1);
      sticker.style.rotate = `${angle}deg`;
    } else {
      const current = parseFloat(getComputedStyle(sticker).width);
      sticker.style.width = (Math.max(10, Math.min(1200, current * (event.deltaY < 0 ? 1.08 : 0.90))) / canvas.clientWidth * 100) + '%';
      clampSticker(sticker);
    }
    event.preventDefault();
  }, { passive: false });

  function duplicateSelected() {
    if (!selected) return setStatus('Select a sticker first');
    const clone = selected.cloneNode(true);
    clone.classList.remove('is-selected');
    clone.dataset.stickerId = `sticker-${nextId++}`;
    const rect = selected.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    clone.style.left = `${((rect.left - canvasRect.left + 20) / canvas.clientWidth) * 100}%`;
    clone.style.top = `${((rect.top - canvasRect.top + 20) / canvas.clientHeight) * 100}%`;
    canvas.appendChild(clone);
    select(clone);
    clampSticker(clone);
  }

  function deleteSelected() {
    if (!selected) return setStatus('Select a sticker first');
    const removing = selected;
    select(null);
    removing.remove();
    setStatus('Sticker deleted');
  }

  function snapshot() {
    return stickers().map(sticker => ({
      id: sticker.dataset.stickerId,
      src: sticker.getAttribute('src'),
      className: sticker.className.replace(' is-selected', ''),
      left: sticker.style.left,
      top: sticker.style.top,
      width: sticker.style.width,
      rotate: sticker.style.rotate,
      ready: sticker.dataset.editorReady || ''
    }));
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(snapshot()));
      setStatus('Layout saved in this browser');
    } catch {
      setStatus('Layout is too large to save');
    }
  }

  function restore() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      canvas.replaceChildren(...data.map(item => {
        const img = new Image();
        img.src = item.src;
        img.alt = '';
        img.className = item.className;
        img.dataset.stickerId = item.id;
        img.dataset.editorReady = item.ready;
        img.style.left = item.left;
        img.style.top = item.top;
        img.style.right = 'auto';
        img.style.bottom = 'auto';
        img.style.width = item.width;
        img.style.height = 'auto';
        img.style.rotate = item.rotate;
        img.draggable = false;
        return img;
      }));
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  function exportLayout() {
    const blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sticker-layout.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    setStatus('Layout exported');
  }

  sizeControl.addEventListener('input', () => {
    if (!selected) return;
    normalize(selected);
    selected.style.width = (Number(sizeControl.value) / canvas.clientWidth * 100) + '%';
    clampSticker(selected);
  });

  rotateControl.addEventListener('input', () => {
    if (!selected) return;
    normalize(selected);
    selected.style.rotate = `${rotateControl.value}deg`;
  });
  fileInput.addEventListener('change', () => {
    [...fileInput.files].forEach((file, index) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const img = new Image();
        img.src = reader.result;
        img.alt = '';
        img.className = 'cover-sticker sticker-custom';
        img.dataset.stickerId = `sticker-${nextId++}`;
        img.dataset.editorReady = 'true';
        img.style.left = `${42 + (index * 18 / canvas.clientWidth) * 100}%`;
        img.style.top = `${42 + (index * 18 / canvas.clientHeight) * 100}%`;
        img.style.width = (150 / canvas.clientWidth * 100) + '%';
        img.style.height = 'auto';
        img.style.rotate = '0deg';
        img.draggable = false;
        canvas.appendChild(img);
        select(img);
      });
      reader.readAsDataURL(file);
    });
    fileInput.value = '';
  });

  panel.addEventListener('click', event => {
    const action = event.target.closest('button')?.dataset.action;
    if (!action) return;
    if (action === 'add') fileInput.click();
    if (action === 'duplicate') duplicateSelected();
    if (action === 'delete') deleteSelected();
    if (action === 'save') save();
    if (action === 'export') exportLayout();
    if (action === 'reset') { localStorage.removeItem(storageKey); location.reload(); }
    if (action === 'close') leaveEditor();
  });

  document.addEventListener('keydown', event => {
    if (/input|textarea/i.test(document.activeElement?.tagName || '')) return;
    if (event.key.toLowerCase() === 'e') toggleEditor();
    if (body.classList.contains('sticker-editing') && event.key === 'Delete') deleteSelected();
    if (body.classList.contains('sticker-editing') && event.key === 'Escape') select(null);
  });

  restore();
  ensureIds();
  requestAnimationFrame(() => stickers().forEach(normalize));
})();










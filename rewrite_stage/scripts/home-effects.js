import { STICKER_CONFIG } from "./sticker-config.js";

const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

function seededRandom(seed) { let value = seed >>> 0; return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296); }
function currentStickerPreset() { return [STICKER_CONFIG.desktop, STICKER_CONFIG.tablet, STICKER_CONFIG.mobile].find(item => innerWidth >= item.minWidth); }

export function createBackground() {
  const layer = document.querySelector(".page-background");
  if (!layer) return;
  const width = layer.clientWidth;
  const specs = [{ type: "hand", width: Math.max(720, width), ratio: 492 / 2901 }, { type: "welcome", width: Math.max(720, width) * .4, ratio: 903 / 6192 }];
  const totalHeight = specs.reduce((sum, item) => sum + item.width * item.ratio, 0);
  const count = Math.ceil(innerHeight / totalHeight) * 2 + 2;
  const fragment = document.createDocumentFragment();
  let top = 0;
  for (let index = 0; index < count; index += 1) { const spec = specs[index % 2]; const strip = document.createElement("div"); const height = spec.width * spec.ratio; strip.className = `background-strip background-strip--${spec.type}`; strip.style.cssText = `top:${top}px;--tile-width:${spec.width}px;--strip-height:${height}px`; fragment.append(strip); top += height; }
  layer.replaceChildren(fragment);
}

export function createStickers() {
  const field = document.querySelector("[data-sticker-field]");
  if (!field) return [];
  const preset = currentStickerPreset(); const random = seededRandom(STICKER_CONFIG.seed + preset.count); const points = [];
  for (let attempts = 0; points.length < preset.count && attempts < preset.count * 140; attempts += 1) { const point = { x: 3 + random() * 94, y: 15 + random() * 80 }; if (points.every(other => Math.hypot(point.x - other.x, (point.y - other.y) * 1.15) >= preset.minDistance)) points.push(point); }
  const stickers = points.map((point, index) => { const image = new Image(); image.src = `assets/stickers/${STICKER_CONFIG.assets[Math.floor(random() * STICKER_CONFIG.assets.length)]}`; image.alt = ""; image.className = "page-sticker"; image.style.cssText = `--x:${point.x}%;--y:${point.y}%;--size:${preset.size}px;--angle:${-28 + random() * 56}deg;--delay:${-random() * 8}s`; image.dataset.index = index; return image; });
  field.replaceChildren(...stickers); return stickers;
}

export function enablePointerEffects(stickers) {
  if (!finePointer.matches || prefersReducedMotion.matches) return;
  const character = document.querySelector("[data-character]"); const field = document.querySelector("[data-sticker-field]"); const states = stickers.map((_, index) => ({ x: 0, y: 0, dx: Math.cos(index * 2.399), dy: Math.sin(index * 2.399) })); let pointer = null; let frame = 0;
  const resetEyes = () => { character?.style.setProperty("--eye-x", "0px"); character?.style.setProperty("--eye-y", "0px"); };
  function render() { frame = 0; if (!pointer || !field) return; const fieldRect = field.getBoundingClientRect(); let moving = false; stickers.forEach((sticker, index) => { const state = states[index]; const x = fieldRect.left + fieldRect.width * parseFloat(sticker.style.getPropertyValue("--x")) / 100; const y = fieldRect.top + fieldRect.height * parseFloat(sticker.style.getPropertyValue("--y")) / 100; const deltaX = x - pointer.x; const deltaY = y - pointer.y; const distance = Math.max(1, Math.hypot(deltaX, deltaY)); if (distance > 7) { state.dx = deltaX / distance; state.dy = deltaY / distance; } const strength = pointer.active ? Math.max(0, 1 - distance / 82) : 0; const target = 42 * strength * strength; state.x += (state.dx * target - state.x) * .16; state.y += (state.dy * target - state.y) * .16; sticker.style.setProperty("--evade-x", `${state.x.toFixed(2)}px`); sticker.style.setProperty("--evade-y", `${state.y.toFixed(2)}px`); if (Math.abs(target) > .05 || Math.abs(state.x) > .05 || Math.abs(state.y) > .05) moving = true; }); if (moving) frame = requestAnimationFrame(render); }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener("pointermove", event => { pointer = { x: event.clientX, y: event.clientY, active: true }; if (character) { const rect = character.getBoundingClientRect(); const dx = event.clientX - (rect.left + rect.width / 2); const dy = event.clientY - (rect.top + rect.height * .42); const length = Math.max(1, Math.hypot(dx, dy)); const strength = Math.min(1, length / 420); character.style.setProperty("--eye-x", `${dx / length * 10 * strength}px`); character.style.setProperty("--eye-y", `${dy / length * (dy < 0 ? 4 : 8) * strength}px`); } schedule(); }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { if (pointer) pointer.active = false; resetEyes(); schedule(); }); addEventListener("blur", () => { if (pointer) pointer.active = false; resetEyes(); schedule(); });
}


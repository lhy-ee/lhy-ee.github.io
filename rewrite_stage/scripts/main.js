import { createBackground, createStickers, enablePointerEffects } from "./home-effects.js";
import { enableCardTilt, enableScrollEffects } from "./scroll-effects.js";

let resizeTimer;
function buildResponsiveArtwork() { createBackground(); const stickers = createStickers(); enablePointerEffects(stickers); }
buildResponsiveArtwork(); enableScrollEffects(); enableCardTilt();
addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(createBackground, 180); });


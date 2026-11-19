/**
 * Visual kit: shared, animated SVG building blocks for every lesson drawing.
 * Pure string functions (no DOM), so they run in the browser and in Node tests.
 *
 * Motion:
 *   - flow(): particles travel along a path (SMIL <animateMotion>, self-contained in the SVG).
 *   - beat(): a group that squeezes on a rhythm (CSS class .vk-beat in /css/styles.css).
 * Colours come from one palette; text uses the page's currentColor so dark mode works.
 */

export const PALETTE = {
  red: "#ef4444",
  redDeep: "#b91c1c",
  redSoft: "#fecaca",
  blue: "#3b82f6",
  blueDeep: "#1d4ed8",
  blueSoft: "#bfdbfe",
  green: "#10b981",
  amber: "#f59e0b",
  slate: "#64748b",
  grid: "#94a3b8"
};

const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const n1 = v => Number(v.toFixed(2));

/** Shared gradients and soft shadow. Same ids in every drawing (identical content, so duplicates are harmless). */
function defs() {
  return `<defs>
    <radialGradient id="vk-red" cx="40%" cy="35%" r="75%"><stop offset="0%" stop-color="#fca5a5"/><stop offset="60%" stop-color="${PALETTE.red}"/><stop offset="100%" stop-color="${PALETTE.redDeep}"/></radialGradient>
    <radialGradient id="vk-blue" cx="40%" cy="35%" r="75%"><stop offset="0%" stop-color="#93c5fd"/><stop offset="60%" stop-color="${PALETTE.blue}"/><stop offset="100%" stop-color="${PALETTE.blueDeep}"/></radialGradient>
    <radialGradient id="vk-lung" cx="45%" cy="40%" r="70%"><stop offset="0%" stop-color="#fecdd3"/><stop offset="100%" stop-color="#fb7185"/></radialGradient>
    <linearGradient id="vk-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/></linearGradient>
    <filter id="vk-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#0f172a" flood-opacity="0.18"/></filter>
  </defs>`;
}

/** The outer <svg>. Every kit drawing uses the same size and type. */
export function frame(inner, title, { w = 360, h = 210 } = {}) {
  return `<svg viewBox="0 0 ${w} ${h}" class="w-full h-64 sm:h-72 select-none vk" role="img" aria-label="${title}" font-family="${FONT}"><title>${title}</title>${defs()}${inner}</svg>`;
}

/**
 * The smaller <svg> for a mystery-scene picture (two sit side by side). Every scene uses this size.
 * Draw inside a 220 × 120 box.
 */
export function sceneFrame(inner, title) {
  return `<svg viewBox="0 0 220 120" class="w-full h-32 sm:h-36 select-none vk vk-scene" role="img" aria-label="${title}" font-family="${FONT}"><title>${title}</title>${defs()}${inner}</svg>`;
}

/**
 * Particles flowing along a path. `count` particles spread evenly, one lap every `dur` seconds.
 * A faint track shows the path even when motion is reduced.
 */
export function flow(d, { color = PALETTE.red, count = 5, dur = 2, r = 3.2, track = true, trackWidth = 8 } = {}) {
  const t = track
    ? `<path d="${d}" fill="none" stroke="${color}" stroke-opacity="0.16" stroke-width="${trackWidth}" stroke-linecap="round"/>`
    : "";
  let dots = "";
  for (let i = 0; i < count; i++) {
    const begin = -n1((dur * i) / Math.max(1, count));
    dots += `<circle r="${r}" fill="${color}" class="vk-particle"><animateMotion dur="${n1(dur)}s" begin="${begin}s" repeatCount="indefinite" path="${d}"/></circle>`;
  }
  return t + dots;
}

/** A group that squeezes on a rhythm: `period` seconds per beat, `depth` 0..1 (how hard it squeezes). */
export function beat(inner, { period = 1, depth = 0.1, origin = "center" } = {}) {
  return `<g class="vk-beat" style="--vk-beat:${n1(period)}s;--vk-squeeze:${n1(1 - depth)};transform-origin:${origin}">${inner}</g>`;
}

/** Rounded label chip. tone: neutral | ok | warn | bad | info. Colours live in styles.css (.vk-chip-*), with dark-mode variants. */
export function chip(x, y, text, { tone = "neutral", anchor = "middle", size = 10 } = {}) {
  const t = ["neutral", "ok", "warn", "bad", "info"].includes(tone) ? tone : "neutral";
  const w = Math.round(String(text).length * size * 0.56 + 16);
  const h = size + 10;
  const x0 = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  return `<g class="vk-chip vk-chip-${t}"><rect x="${n1(x0)}" y="${n1(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" stroke-width="1" filter="url(#vk-shadow)"/>
    <text x="${n1(x0 + w / 2)}" y="${n1(y + size * 0.36)}" text-anchor="middle" font-size="${size}" font-weight="600">${text}</text></g>`;
}

/** Small spaced caps caption in the page colour (part names, axis notes). */
export function caption(x, y, text, { anchor = "start", opacity = 0.55, size = 8.5 } = {}) {
  return `<text x="${n1(x)}" y="${n1(y)}" text-anchor="${anchor}" font-size="${size}" font-weight="700" letter-spacing="0.08em" fill="currentColor" opacity="${opacity}">${text}</text>`;
}

/** An emoji used as an icon (cat, house, coin...). */
export function emoji(x, y, ch, size = 22) {
  return `<text x="${n1(x)}" y="${n1(y)}" text-anchor="middle" font-size="${size}">${ch}</text>`;
}

/** A path that draws itself in once (curves, routes). `attrs` = extra SVG attributes (stroke, width...). */
export function drawIn(d, attrs, dur = 1.2) {
  return `<path d="${d}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0" ${attrs}><animate attributeName="stroke-dashoffset" from="100" to="0" dur="${dur}s" fill="freeze"/></path>`;
}

/** Fade a group in after `begin` seconds (one-shot). */
export function appear(inner, { begin = 0, dur = 0.4 } = {}) {
  return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${begin}s" dur="${dur}s" fill="freeze"/>${inner}</g>`;
}

/** Slide a group into place from `dx` px to the side (one-shot). */
export function slideIn(inner, dx, { dur = 0.7, begin = 0 } = {}) {
  return `<g><animateTransform attributeName="transform" type="translate" from="${dx} 0" to="0 0" dur="${dur}s" begin="${begin}s" fill="freeze"/>${inner}</g>`;
}

/** A big number with a small caption under it. */
export function stat(x, y, value, caption, { color = "currentColor", size = 22, anchor = "start" } = {}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="800" style="fill:${color}">${value}</text>
    <text x="${x}" y="${y + 14}" text-anchor="${anchor}" font-size="9.5" font-weight="500" fill="currentColor" opacity="0.7">${caption}</text>`;
}

/** Horizontal stacked bar: parts = [{ value, color }], total = full width value. */
export function stackBar(x, y, w, h, parts, total) {
  let cx = x;
  let segs = "";
  for (const p of parts) {
    const pw = total > 0 ? (p.value / total) * w : 0;
    if (pw > 0.5) segs += `<rect x="${n1(cx)}" y="${y}" width="${n1(pw)}" height="${h}" fill="${p.color}"/>`;
    cx += pw;
  }
  return `<g><clipPath id="vk-bar-${x}-${y}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/></clipPath>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${PALETTE.grid}" fill-opacity="0.2"/>
    <g clip-path="url(#vk-bar-${x}-${y})">${segs}</g></g>`;
}

/**
 * A container (jug/tank) filled to `frac` (0..1), with a gentle rise animation on draw.
 */
export function tank(x, y, w, h, frac, color, { label = "" } = {}) {
  const f = Math.max(0, Math.min(1, frac));
  const fh = n1(f * (h - 6));
  const fy = n1(y + h - 3 - fh);
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>
    <rect x="${x + 3}" y="${fy}" width="${w - 6}" height="${fh}" rx="5" fill="${color}" fill-opacity="0.85">
      <animate attributeName="height" from="0" to="${fh}" dur="0.6s" fill="freeze"/>
      <animate attributeName="y" from="${y + h - 3}" to="${fy}" dur="0.6s" fill="freeze"/>
    </rect>
    <rect x="${x + 3}" y="${y + 3}" width="${n1((w - 6) * 0.35)}" height="${h - 6}" rx="4" fill="url(#vk-glass)"/>
    ${label ? `<text x="${x + w / 2}" y="${y + h + 13}" text-anchor="middle" font-size="9.5" font-weight="600" fill="currentColor" opacity="0.75">${label}</text>` : ""}`;
}

/**
 * A valve leaflet hinged at (hx, hy), drawn closed toward (tx, ty). It swings open by `openDeg`
 * between beats and shuts during the squeeze (first 30% of each beat).
 */
export function leaflet(hx, hy, tx, ty, { period = 1, openDeg = 60, color = "#f8fafc", stroke = PALETTE.redDeep } = {}) {
  const p = n1(period);
  return `<g>
      <animateTransform attributeName="transform" type="rotate" dur="${p}s" repeatCount="indefinite"
        values="0 ${hx} ${hy};0 ${hx} ${hy};${openDeg} ${hx} ${hy};${openDeg} ${hx} ${hy};0 ${hx} ${hy}" keyTimes="0;0.3;0.42;0.9;1"/>
      <line x1="${hx}" y1="${hy}" x2="${tx}" y2="${ty}" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
      <line x1="${hx}" y1="${hy}" x2="${tx}" y2="${ty}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`;
}

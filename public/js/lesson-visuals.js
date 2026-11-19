/**
 * Living-object renderers for the generic lesson player (/lesson).
 * Pure functions: renderVisual(objectSpec, dial1, dial2) -> { svg, banner }.
 * One renderer per topic root system; `objectSpec.layer` selects what the unit focuses on,
 * so all units of a topic share one evolving drawing (Gate 1: no metaphor hopping).
 */

const C = {
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
  slate: "#64748b",
  grid: "#94a3b8"
};

function svgWrap(inner, title) {
  return `<svg viewBox="0 0 360 210" class="w-full h-56 select-none" role="img" aria-label="${title}"><title>${title}</title>${inner}</svg>`;
}

// ============================================================================
// AREA vs PERIMETER — one rectangle on a unit grid
// ============================================================================
function renderRectangle(spec, d1, d2) {
  const layer = spec.layer;
  const cell = 14;
  const ox = 16;
  const oy = 18;
  const n = 12;

  let w = d1;
  let h = d2;
  let half = null;
  if (layer === "tradeoff") {
    half = d2;
    h = half - w;
  }
  const valid = w >= 1 && h >= 1;

  // Faint unit grid
  let g = "";
  for (let i = 0; i <= n; i++) {
    g += `<line x1="${ox}" y1="${oy + i * cell}" x2="${ox + n * cell}" y2="${oy + i * cell}" stroke="${C.grid}" stroke-width="0.5" opacity="0.45"/>`;
    g += `<line x1="${ox + i * cell}" y1="${oy}" x2="${ox + i * cell}" y2="${oy + n * cell}" stroke="${C.grid}" stroke-width="0.5" opacity="0.45"/>`;
  }

  let shape = "";
  let panel = "";
  let banner = "";

  if (!valid) {
    shape = `<text x="${ox + (n * cell) / 2}" y="${oy + (n * cell) / 2}" text-anchor="middle" font-size="11" font-family="monospace" fill="${C.red}" font-weight="bold">✖ No rectangle possible</text>`;
    panel = `
      <text x="210" y="50" font-size="11" font-family="monospace" fill="currentColor" font-weight="bold">Fence: ${2 * half} units</text>
      <text x="210" y="72" font-size="10.5" font-family="sans-serif" fill="${C.red}">Width ${w} uses the whole</text>
      <text x="210" y="88" font-size="10.5" font-family="sans-serif" fill="${C.red}">half-fence (${half}): height 0.</text>`;
    banner = `⚠️ NO RECTANGLE: width (${w}) is not smaller than the half-fence (${half}), so there is no fence left for the height.`;
    return { svg: svgWrap(g + shape + panel, "No rectangle possible with this fence"), banner };
  }

  const x = ox;
  const y = oy + (n - h) * cell;
  const pw = w * cell;
  const ph = h * cell;
  const area = w * h;
  const perim = 2 * (w + h);

  if (layer === "area" || layer === "tradeoff") {
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        shape += `<rect x="${x + c * cell + 1}" y="${y + r * cell + 1}" width="${cell - 2}" height="${cell - 2}" rx="2" fill="${layer === "area" ? C.blue : C.green}" fill-opacity="0.55"/>`;
      }
    }
  }
  shape += `<rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="none" stroke="${layer === "perimeter" ? C.amber : "currentColor"}" stroke-width="${layer === "perimeter" ? 3.5 : 2}"/>`;

  // Side labels (on the edge)
  shape += `<text x="${x + pw / 2}" y="${y - 4}" text-anchor="middle" font-size="9.5" font-family="monospace" fill="currentColor" font-weight="bold">${w}</text>`;
  shape += `<text x="${x + pw + 4}" y="${y + ph / 2 + 3}" font-size="9.5" font-family="monospace" fill="currentColor" font-weight="bold">${h}</text>`;

  if (layer === "perimeter") {
    panel = `
      <text x="210" y="40" font-size="11" font-family="monospace" fill="currentColor" font-weight="bold">PERIMETER (edge)</text>
      <text x="210" y="64" font-size="10.5" font-family="monospace" fill="currentColor">${w} + ${h} + ${w} + ${h}</text>
      <text x="210" y="84" font-size="10.5" font-family="monospace" fill="currentColor">= 2 × (${w} + ${h})</text>
      <text x="210" y="112" font-size="20" font-family="monospace" fill="${C.amber}" font-weight="bold">${perim}</text>
      <text x="${210 + String(perim).length * 13 + 6}" y="112" font-size="10" font-family="sans-serif" fill="currentColor">units around</text>`;
    banner = `📏 PERIMETER: walk the edge ${w} + ${h} + ${w} + ${h} = ${perim} units.`;
  } else if (layer === "area") {
    panel = `
      <text x="210" y="40" font-size="11" font-family="monospace" fill="currentColor" font-weight="bold">AREA (inside)</text>
      <text x="210" y="64" font-size="10.5" font-family="monospace" fill="currentColor">${h} row${h > 1 ? "s" : ""} × ${w} per row</text>
      <text x="210" y="84" font-size="10.5" font-family="monospace" fill="currentColor">= ${w} × ${h}</text>
      <text x="210" y="112" font-size="20" font-family="monospace" fill="${C.blue}" font-weight="bold">${area}</text>
      <text x="${210 + String(area).length * 13 + 6}" y="112" font-size="10" font-family="sans-serif" fill="currentColor">squares inside</text>`;
    banner = `🟦 AREA: ${h} row${h > 1 ? "s" : ""} of ${w} squares = ${area} square units cover the inside.`;
  } else {
    // tradeoff: fixed fence, area for every possible width
    const widths = [];
    for (let k = 1; k < half; k++) widths.push(k);
    const maxArea = Math.max(...widths.map(k => k * (half - k)));
    const barW = Math.min(12, 130 / widths.length);
    const bars = widths
      .map((k, i) => {
        const a = k * (half - k);
        const bh = (a / maxArea) * 60;
        const bx = 210 + i * (barW + 2);
        return `<rect x="${bx}" y="${190 - bh}" width="${barW}" height="${bh}" rx="1.5" fill="${k === w ? C.green : C.grid}" fill-opacity="${k === w ? 1 : 0.5}"/>`;
      })
      .join("");
    panel = `
      <text x="210" y="36" font-size="11" font-family="monospace" fill="currentColor" font-weight="bold">FENCE FIXED: ${2 * half}</text>
      <text x="210" y="56" font-size="10.5" font-family="monospace" fill="currentColor">height = ${half} − ${w} = ${h}</text>
      <text x="210" y="78" font-size="10.5" font-family="monospace" fill="currentColor">area = ${w} × ${h} =</text>
      <text x="210" y="104" font-size="20" font-family="monospace" fill="${C.green}" font-weight="bold">${area}</text>
      <text x="${210 + String(area).length * 13 + 6}" y="104" font-size="9.5" font-family="sans-serif" fill="currentColor">max ${maxArea}</text>
      <text x="210" y="124" font-size="8.5" font-family="sans-serif" fill="currentColor" opacity="0.7">area for each width ↓</text>
      ${bars}`;
    banner =
      area === maxArea
        ? `🏆 BEST SHAPE: ${w} × ${h} gives the most space (${area}) for a ${2 * half}-unit fence.`
        : `🪵 SAME FENCE (${2 * half}), area ${area}. The squarest shape would hold ${maxArea}.`;
  }

  return { svg: svgWrap(g + shape + panel, `Rectangle ${w} by ${h}`), banner };
}

// ============================================================================
// Registry
// ============================================================================
const RENDERERS = {
  avp_rectangle_grid: renderRectangle
};

export function hasVisual(spec) {
  return Boolean(spec && RENDERERS[spec.type]);
}

export function renderVisual(spec, d1, d2) {
  const fn = RENDERERS[spec?.type];
  if (!fn) {
    return { svg: "", banner: "" };
  }
  return fn(spec, d1, d2);
}

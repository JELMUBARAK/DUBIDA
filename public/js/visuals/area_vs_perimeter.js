/**
 * Area vs Perimeter: one rectangle on a unit grid.
 * Drawings for one topic, built with the shared visual kit (../visual-kit.js).
 * UNIT_RENDERERS:  object_spec.type  -> (spec, dial1, dial2) => { svg, banner }
 * SCENE_RENDERERS: scene.toy.visual  -> ({ last, tried }) => svg   (last = option index or null)
 */

import { PALETTE as P, frame, sceneFrame, flow, chip, stat } from "../visual-kit.js";

const r2 = v => Number(v.toFixed(2));
const FENCE = "#a16207"; // wood brown for fences and frames

// ============================================================================
// Local helpers (kit candidates: rectPath, dotGrid, tiles, fence)
// ============================================================================

/** Closed path around a rectangle, clockwise from the top-left corner (for flow() walkers). */
function rectPath(x, y, w, h) {
  return `M${r2(x)},${r2(y)} L${r2(x + w)},${r2(y)} L${r2(x + w)},${r2(y + h)} L${r2(x)},${r2(y + h)} Z`;
}

/** Faint dots at every grid corner: the unit grid, without heavy lines. */
function dotGrid(x, y, cols, rows, cell) {
  let g = "";
  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      g += `<circle cx="${r2(x + i * cell)}" cy="${r2(y + j * cell)}" r="1.1" fill="${P.grid}" fill-opacity="0.55"/>`;
    }
  }
  return g;
}

/**
 * Unit-square tiles. With `animate`, tiles appear one by one, bottom row first, left to right
 * (so the learner sees rows × columns being counted). `total` seconds for the whole fill.
 */
function tiles(x, y, cols, rows, cell, { color = P.blue, animate = true, total = 1.2, opacity = 0.75 } = {}) {
  const count = cols * rows;
  const step = count > 0 ? Math.min(0.09, total / count) : 0;
  let out = "";
  let k = 0;
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = 0; c < cols; c++) {
      const tx = r2(x + c * cell + 1);
      const ty = r2(y + r * cell + 1);
      const s = r2(cell - 2);
      out += animate
        ? `<rect x="${tx}" y="${ty}" width="${s}" height="${s}" rx="2.5" fill="${color}" fill-opacity="0" stroke="${color}" stroke-opacity="0.35"><animate attributeName="fill-opacity" from="0" to="${opacity}" begin="${r2(k * step)}s" dur="0.18s" fill="freeze"/></rect>`
        : `<rect x="${tx}" y="${ty}" width="${s}" height="${s}" rx="2.5" fill="${color}" fill-opacity="${opacity}" stroke="${color}" stroke-opacity="0.35"/>`;
      k++;
    }
  }
  return out;
}

/** A fence round a rectangle: thick rail, a post at every unit, and walkers travelling the edge. */
function fence(x, y, w, h, cell, { color = P.amber, walkers = 8, dur = 4, posts = true, rail = 3.5 } = {}) {
  const d = rectPath(x, y, w, h);
  let p = "";
  if (posts) {
    const cols = Math.round(w / cell);
    const rows = Math.round(h / cell);
    for (let i = 0; i <= cols; i++) {
      for (const yy of [y, y + h]) p += `<rect x="${r2(x + i * cell - 1.6)}" y="${r2(yy - 3.2)}" width="3.2" height="6.4" rx="1" fill="${FENCE}"/>`;
    }
    for (let j = 1; j < rows; j++) {
      for (const xx of [x, x + w]) p += `<rect x="${r2(xx - 3.2)}" y="${r2(y + j * cell - 1.6)}" width="6.4" height="3.2" rx="1" fill="${FENCE}"/>`;
    }
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${rail}" stroke-linejoin="round"/>${p}${flow(d, { color, count: walkers, dur, r: 2.6, track: false })}`;
}

/** Plain text in the page colour. */
function label(x, y, text, { size = 10, weight = 600, anchor = "start", opacity = 1, color = "currentColor" } = {}) {
  return `<text x="${r2(x)}" y="${r2(y)}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}" opacity="${opacity}">${text}</text>`;
}

// ============================================================================
// UNITS — one rectangle on a unit grid (perimeter · area · trade-off)
// ============================================================================
function renderRectangle(spec, d1, d2) {
  const layer = spec.layer;
  const n = layer === "tradeoff" ? 11 : 8; // largest side the dials allow
  const cell = Math.floor(176 / n);
  const ox = 14;
  const oy = 24;
  const base = oy + n * cell; // bottom edge of the grid

  let w = d1;
  let h = d2;
  let half = null;
  if (layer === "tradeoff") {
    half = d2;
    h = half - w;
  }
  const valid = w >= 1 && h >= 1;
  const grid = dotGrid(ox, oy, n, n, cell);

  if (!valid) {
    // The fence is used up by the width: it lies flat, with no height and nothing inside.
    const flatW = Math.min(w, n) * cell;
    const inner = `
      ${grid}
      <line x1="${ox}" y1="${base}" x2="${ox + flatW}" y2="${base}" stroke="${P.red}" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 4"/>
      ${chip(ox + (n * cell) / 2, oy + (n * cell) / 2, "✖ No rectangle possible", { tone: "bad", size: 10.5 })}
      ${chip(218, 40, `🪵 Fence: ${2 * half} units`, { tone: "neutral", size: 10.5, anchor: "start" })}
      ${label(218, 76, `Width ${w} uses the whole`, { size: 11, color: P.red })}
      ${label(218, 92, `half-fence (${half}): height 0.`, { size: 11, color: P.red })}
      ${label(218, 124, "Make the width smaller than", { size: 10, opacity: 0.7 })}
      ${label(218, 138, `the half-fence (${half}).`, { size: 10, opacity: 0.7 })}`;
    const banner = `⚠️ NO RECTANGLE: width (${w}) is not smaller than the half-fence (${half}), so there is no fence left for the height.`;
    return { svg: frame(inner, "No rectangle possible with this fence"), banner };
  }

  const x = ox;
  const y = base - h * cell;
  const pw = w * cell;
  const ph = h * cell;
  const area = w * h;
  const perim = 2 * (w + h);

  // Side lengths sit on the edges, like a plan drawing.
  const sides = `
    ${chip(x + pw / 2, y - 9, `${w}`, { size: 9 })}
    ${chip(x + pw + 11, y + ph / 2, `${h}`, { size: 9 })}`;

  let shape = "";
  let panel = "";
  let banner = "";

  if (layer === "perimeter") {
    shape = `
      <rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="${P.amber}" fill-opacity="0.06"/>
      ${fence(x, y, pw, ph, cell, { color: P.amber, walkers: Math.min(perim, 14), dur: 1 + perim * 0.22 })}`;
    panel = `
      ${chip(218, 30, "📏 PERIMETER · the edge", { tone: "warn", size: 10, anchor: "start" })}
      ${label(218, 66, `${w} + ${h} + ${w} + ${h}`, { size: 13, weight: 700 })}
      ${label(218, 86, `= 2 × (${w} + ${h})`, { size: 12, opacity: 0.75 })}
      ${stat(218, 128, `${perim}`, "units around the edge", { color: P.amber, size: 30 })}
      ${label(218, 176, "Only the edge counts.", { size: 10, opacity: 0.65 })}
      ${label(218, 190, "The inside stays empty.", { size: 10, opacity: 0.65 })}`;
    banner = `📏 PERIMETER: walk the edge ${w} + ${h} + ${w} + ${h} = ${perim} units.`;
  } else if (layer === "area") {
    shape = `
      ${tiles(x, y, w, h, cell, { color: P.blue })}
      <rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="2"/>`;
    panel = `
      ${chip(218, 30, "🟦 AREA · the inside", { tone: "info", size: 10, anchor: "start" })}
      ${label(218, 66, `${h} row${h > 1 ? "s" : ""} × ${w} per row`, { size: 13, weight: 700 })}
      ${label(218, 86, `= ${w} × ${h}`, { size: 12, opacity: 0.75 })}
      ${stat(218, 128, `${area}`, "squares cover the inside", { color: P.blue, size: 30 })}
      ${label(218, 176, `The edge would be ${perim},`, { size: 10, opacity: 0.65 })}
      ${label(218, 190, "but that's a different thing.", { size: 10, opacity: 0.65 })}`;
    banner = `🟦 AREA: ${h} row${h > 1 ? "s" : ""} of ${w} squares = ${area} square units cover the inside.`;
  } else {
    // tradeoff: fixed fence, area for every possible width
    const widths = [];
    for (let k = 1; k < half; k++) widths.push(k);
    const maxArea = Math.max(...widths.map(k => k * (half - k)));
    const best = area === maxArea;
    const bx0 = 218;
    const bw = 134;
    const gap = 2;
    const barW = Math.min(16, (bw - gap * (widths.length - 1)) / widths.length);
    const baseY = 200;
    const bars = widths
      .map((k, i) => {
        const a = k * (half - k);
        const bh = Math.max(2, (a / maxArea) * 48);
        const bx = bx0 + i * (barW + gap);
        const cur = k === w;
        const fill = cur ? (best ? P.green : P.amber) : P.grid;
        return `<rect x="${r2(bx)}" y="${r2(baseY - bh)}" width="${r2(barW)}" height="${r2(bh)}" rx="2" fill="${fill}" fill-opacity="${cur ? 1 : 0.45}"/>${
          cur ? `<text x="${r2(bx + barW / 2)}" y="${r2(baseY - bh - 4)}" text-anchor="middle" font-size="8.5" font-weight="700" fill="${fill}">${a}</text>` : ""
        }`;
      })
      .join("");
    shape = `
      ${tiles(x, y, w, h, cell, { color: P.green, total: 0.8 })}
      ${fence(x, y, pw, ph, cell, { color: P.amber, walkers: Math.min(perim, 14), dur: 1 + perim * 0.22, rail: 3 })}`;
    panel = `
      ${chip(218, 22, `🪵 Fence fixed: ${2 * half}`, { tone: "warn", size: 10, anchor: "start" })}
      ${label(218, 50, `height = ${half} − ${w} = ${h}`, { size: 11.5, weight: 700 })}
      ${label(218, 68, `area = ${w} × ${h}`, { size: 11.5, opacity: 0.8 })}
      ${stat(218, 100, `${area}`, `inside · best is ${maxArea}`, { color: best ? P.green : P.amber, size: 24 })}
      ${best ? chip(304, 104, "🏆 best shape", { tone: "ok", size: 9, anchor: "start" }) : ""}
      ${label(218, 134, "area for each width ↓", { size: 9, opacity: 0.65 })}
      ${bars}`;
    banner = best
      ? `🏆 BEST SHAPE: ${w} × ${h} gives the most space (${area}) for a ${2 * half}-unit fence.`
      : `🪵 SAME FENCE (${2 * half}), area ${area}. The squarest shape would hold ${maxArea}.`;
  }

  return { svg: frame(grid + shape + sides + panel, `Rectangle ${w} by ${h}`), banner };
}

// ============================================================================
// SCENES — 6 mystery pictures (220 × 120 each)
// ============================================================================

/** A small landscape painting, for the picture frame. */
function painting(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#bae6fd"/>
    <circle cx="${r2(x + w * 0.78)}" cy="${r2(y + h * 0.28)}" r="${r2(h * 0.14)}" fill="#fde047"/>
    <path d="M${x},${r2(y + h * 0.75)} Q${r2(x + w * 0.3)},${r2(y + h * 0.4)} ${r2(x + w * 0.55)},${r2(y + h * 0.7)} T${x + w},${r2(y + h * 0.6)} L${x + w},${y + h} L${x},${y + h} Z" fill="#4ade80"/>`;
}

function sceneFrameRibbon({ last }) {
  // 3 cm × 2 cm picture. 0 = ribbon round the edge, 1 = paint the middle.
  const cell = 28;
  const x = 24;
  const y = 24;
  const w = 3 * cell;
  const h = 2 * cell;
  const bare = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${P.grid}" stroke-width="2" stroke-dasharray="4 3"/>`;
  let inner = dotGrid(x, y, 3, 2, cell);
  let side;
  if (last === 0) {
    inner += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.grid}" fill-opacity="0.08"/>${fence(x, y, w, h, cell, { color: "#ec4899", walkers: 10, dur: 3, posts: false, rail: 5 })}`;
    side = chip(170, 60, "🎀 10 cm", { tone: "ok", size: 11 });
  } else if (last === 1) {
    inner += painting(x, y, w, h) + bare;
    side = chip(170, 60, "edge bare", { tone: "warn", size: 10 });
  } else {
    inner += bare;
    side = chip(170, 60, "3 × 2 cm", { size: 10 });
  }
  inner += label(x + w / 2, y - 7, "3 cm", { size: 9, anchor: "middle", opacity: 0.7 }) + label(x + w + 6, y + h / 2 + 3, "2 cm", { size: 9, opacity: 0.7 });
  return sceneFrame(inner + side, "A picture frame: ribbon round the edge or paint in the middle");
}

function sceneSheep({ last }) {
  // 4 m × 2 m field. 0 = fence the edge, 1 = plant more grass (sheep wander off).
  const cell = 26;
  const x = 18;
  const y = 30;
  const w = 4 * cell;
  const h = 2 * cell;
  const lush = last === 1;
  let inner = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${lush ? "#16a34a" : "#86efac"}" fill-opacity="${lush ? 0.75 : 0.6}"/>`;
  if (lush) {
    for (let i = 0; i < 9; i++) inner += `<text x="${x + 8 + ((i * 37) % (w - 14))}" y="${y + 14 + ((i * 23) % (h - 12))}" font-size="9">🌼</text>`;
  }
  if (last === 0) inner += fence(x, y, w, h, cell, { color: FENCE, walkers: 8, dur: 3.2, rail: 3 });
  // Sheep: inside the field, or strolling out of it when nothing holds them in.
  const sheep = [
    [x + 30, y + 30],
    [x + 62, y + 44]
  ];
  for (const [sx, sy] of sheep) {
    inner += lush
      ? `<text font-size="16" x="0" y="0">🐑<animateMotion dur="3s" repeatCount="indefinite" path="M${sx},${sy} L${sx + 70},${sy + 40}"/></text>`
      : `<text x="${sx}" y="${sy}" font-size="16">🐑</text>`;
  }
  const side =
    last === 0 ? chip(175, 56, "🪵 12 m", { tone: "ok", size: 11 }) : last === 1 ? chip(175, 56, "🐑 gone!", { tone: "warn", size: 10.5 }) : chip(175, 56, "4 × 2 m", { size: 10 });
  inner += label(x + w / 2, y - 8, "4 m", { size: 9, anchor: "middle", opacity: 0.7 });
  return sceneFrame(inner + side, "A sheep field: fence the edge or plant more grass");
}

function sceneFloor({ last }) {
  // 4 × 3 floor. 0 = count tiles to cover it, 1 = measure the edge.
  const cell = 24;
  const x = 18;
  const y = 18;
  const w = 4 * cell;
  const h = 3 * cell;
  let inner = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e7e5e4" fill-opacity="0.5" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>`;
  inner += dotGrid(x, y, 4, 3, cell);
  if (last === 0) inner += tiles(x, y, 4, 3, cell, { color: "#0ea5e9", total: 1 });
  if (last === 1) inner += fence(x, y, w, h, cell, { color: P.amber, walkers: 10, dur: 3.5, posts: false, rail: 3 });
  const side =
    last === 0 ? chip(172, 54, "12 tiles", { tone: "ok", size: 11 }) : last === 1 ? chip(172, 54, "edge: 14", { tone: "warn", size: 10.5 }) : chip(172, 54, "bare floor", { size: 10 });
  return sceneFrame(inner + side, "A floor: count tiles or measure the edge");
}

function sceneChocolate({ last }) {
  // 6 × 4 bar. 0 = count the squares, 1 = measure the wrapper edge.
  const cell = 15;
  const x = 16;
  const y = 22;
  const w = 6 * cell;
  const h = 4 * cell;
  let inner;
  if (last === 0) {
    inner = `<rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" rx="4" fill="#78350f"/>${tiles(x, y, 6, 4, cell, { color: "#b45309", total: 1, opacity: 1 })}`;
  } else {
    // Still wrapped: you can't see the squares.
    inner = `<rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" rx="4" fill="#7c3aed"/>
      <rect x="${x + 8}" y="${y + h / 2 - 9}" width="${w - 16}" height="18" rx="9" fill="#fef3c7"/>
      ${label(x + w / 2, y + h / 2 + 4, "CHOC", { size: 10, weight: 800, anchor: "middle", color: "#7c3aed" })}`;
    if (last === 1) inner += fence(x - 2, y - 2, w + 4, h + 4, cell, { color: P.amber, walkers: 10, dur: 3.5, posts: false, rail: 3 });
  }
  const side =
    last === 0 ? chip(166, 52, "24 squares", { tone: "ok", size: 10.5 }) : last === 1 ? chip(166, 52, "edge: 20", { tone: "warn", size: 10.5 }) : chip(166, 52, "6 × 4 bar", { size: 10 });
  return sceneFrame(inner + side, "A chocolate bar: count the squares or measure the wrapper");
}

/**
 * Same fence, two shapes (used by the chicken run and the ribbon card).
 * shapes[k] = [cols, rows]; before any tap the fence/ribbon is still rolled up.
 */
function sameFenceScene({ last }, { shapes, color, unit, emoji, roll, title, crowd }) {
  if (last === null) {
    const inner = `<circle cx="70" cy="62" r="26" fill="none" stroke="${color}" stroke-width="5"/>
      <circle cx="70" cy="62" r="17" fill="none" stroke="${color}" stroke-width="4" stroke-opacity="0.7"/>
      <circle cx="70" cy="62" r="8" fill="${color}" fill-opacity="0.5"/>
      ${emoji ? `<text x="120" y="70" font-size="18">${emoji}</text><text x="142" y="78" font-size="14">${emoji}</text>` : ""}
      ${chip(166, 30, roll, { size: 10 })}`;
    return sceneFrame(inner, title);
  }
  const [cols, rows] = shapes[last];
  const cell = Math.min(22, Math.floor(130 / Math.max(cols, 1)), Math.floor(92 / rows));
  const w = cols * cell;
  const h = rows * cell;
  const x = 14;
  const y = 14 + (92 - h) / 2;
  const area = cols * rows;
  const square = cols === rows;
  let inner = tiles(x, y, cols, rows, cell, { color: square ? P.green : P.amber, total: 0.9, opacity: 0.55 });
  inner += fence(x, y, w, h, cell, { color, walkers: 8, dur: 3, posts: Boolean(emoji), rail: 3 });
  if (emoji) {
    // Chickens: room to move in the square, squashed in a row in the strip.
    const spots = square ? [[x + 10, y + 22], [x + 40, y + 48], [x + 18, y + 62]] : [[x + 6, y + 16], [x + 22, y + 16], [x + 38, y + 16]];
    for (const [cx, cy] of spots) inner += `<text x="${cx}" y="${cy}" font-size="${square ? 15 : 12}">${emoji}</text>`;
  }
  inner += chip(176, 44, `${area} ${unit}`, { tone: square ? "ok" : "warn", size: 11 });
  inner += label(176, 74, square ? "same fence," : crowd, { size: 9, anchor: "middle", opacity: 0.75 });
  inner += label(176, 86, square ? "more inside!" : "", { size: 9, anchor: "middle", opacity: 0.75 });
  return sceneFrame(inner, title);
}

const sceneChickens = s =>
  sameFenceScene(s, {
    shapes: [[5, 1], [3, 3]],
    color: FENCE,
    unit: "m²",
    emoji: "🐔",
    roll: "🪵 12 m of fence",
    title: "A chicken run: long and thin, or square",
    crowd: "squashed!"
  });

const sceneCard = s =>
  sameFenceScene(s, {
    shapes: [[7, 1], [4, 4]],
    color: "#ec4899",
    unit: "cm²",
    emoji: "",
    roll: "🎀 16 cm ribbon",
    title: "A ribbon card: a strip or a square",
    crowd: "a thin strip"
  });

export const UNIT_RENDERERS = {
  avp_rectangle_grid: renderRectangle
};

export const SCENE_RENDERERS = {
  avp_frame: sceneFrameRibbon,
  avp_sheep: sceneSheep,
  avp_floor: sceneFloor,
  avp_chocolate: sceneChocolate,
  avp_chickens: sceneChickens,
  avp_card: sceneCard
};

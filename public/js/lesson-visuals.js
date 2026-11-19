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
// HEART — one double pump in a double loop
// ============================================================================
function box(x, y, w, h, label, sub, stroke, fill = "none", fillOpacity = 0.15) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" font-size="10" font-family="monospace" fill="currentColor" font-weight="bold">${label}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 12}" text-anchor="middle" font-size="9" font-family="sans-serif" fill="currentColor">${sub}</text>` : ""}`;
}

function arrow(x1, y1, x2, y2, color, width = 3, cls = "bridge-encode") {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - Math.cos(ang) * 8;
  const hy = y2 - Math.sin(ang) * 8;
  const px = Math.cos(ang + Math.PI / 2) * 5;
  const py = Math.sin(ang + Math.PI / 2) * 5;
  return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${color}" stroke-width="${width}" class="${cls}"/>
    <polygon points="${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}" fill="${color}"/>`;
}

function renderHeart(spec, d1, d2) {
  const layer = spec.layer;

  if (layer === "valves") {
    const seal = d1;
    const amount = [40, 55, 70][d2 - 1];
    const fwdFrac = [0.6, 0.8, 1][seal];
    const forward = Math.round(amount * fwdFrac);
    const back = amount - forward;
    const valveColor = seal === 2 ? C.green : seal === 1 ? C.amber : C.red;
    const inner = `
      ${box(14, 60, 82, 70, "ATRIUM", "upper chamber", C.slate, C.blue)}
      <rect x="104" y="80" width="10" height="30" rx="3" fill="${valveColor}"/>
      <text x="109" y="124" text-anchor="middle" font-size="8.5" font-family="monospace" fill="${valveColor}" font-weight="bold">${["LEAKY", "PART", "SEALED"][seal]}</text>
      ${box(122, 50, 100, 90, "VENTRICLE", `squeeze ${d2}/3`, C.slate, C.red, 0.1 + d2 * 0.08)}
      <rect x="230" y="80" width="10" height="30" rx="3" fill="${C.green}"/>
      ${box(250, 60, 96, 70, "ARTERY", "out to the loop", C.slate, C.red)}
      ${arrow(222, 70, 250, 70, C.green)}
      <text x="236" y="40" text-anchor="middle" font-size="11" font-family="monospace" fill="${C.green}" font-weight="bold">${forward} mL ➜</text>
      ${back > 0 ? `${arrow(122, 120, 96, 120, C.red, 3, "bridge-retrieve")}<text x="80" y="160" text-anchor="middle" font-size="11" font-family="monospace" fill="${C.red}" font-weight="bold">⟲ ${back} mL back</text>` : `<text x="80" y="160" text-anchor="middle" font-size="10" font-family="monospace" fill="${C.green}" font-weight="bold">0 mL back</text>`}
      <text x="180" y="190" text-anchor="middle" font-size="10" font-family="sans-serif" fill="currentColor">Each squeeze pushes ${amount} mL</text>`;
    const banner =
      back > 0
        ? `⚠️ LEAKY VALVE: of ${amount} mL squeezed, ${back} mL leaks back into the atrium and only ${forward} mL goes forward.`
        : `✅ SEALED VALVE: all ${amount} mL goes forward, nothing leaks back.`;
    return { svg: svgWrap(inner, "One side of the heart: atrium, valve, ventricle, artery"), banner };
  }

  if (layer === "two_sides") {
    const right = d1;
    const left = d2;
    const diff = right - left;
    const lungsBuild = diff > 0 ? diff : 0;
    const bodyBuild = diff < 0 ? -diff : 0;
    const inner = `
      ${box(125, 8, 110, 46, "LUNGS", lungsBuild ? `+${lungsBuild} L/min building up` : "balanced", lungsBuild ? C.red : C.slate, C.blue, lungsBuild ? 0.12 + lungsBuild * 0.08 : 0.12)}
      ${box(18, 82, 96, 48, "RIGHT PUMP", `${right} L/min`, C.slate, C.blue)}
      ${box(246, 82, 96, 48, "LEFT PUMP", `${left} L/min`, C.slate, C.red)}
      ${box(125, 156, 110, 46, "BODY", bodyBuild ? `+${bodyBuild} L/min in veins` : "balanced", bodyBuild ? C.red : C.slate, C.red, bodyBuild ? 0.12 + bodyBuild * 0.08 : 0.12)}
      ${arrow(66, 82, 125, 40, C.blue)}
      ${arrow(235, 40, 294, 82, C.red)}
      ${arrow(294, 130, 235, 180, C.red)}
      ${arrow(125, 180, 66, 130, C.blue)}
      <text x="60" y="58" text-anchor="middle" font-size="9" font-family="monospace" fill="currentColor">${right} in ➜</text>
      <text x="300" y="58" text-anchor="middle" font-size="9" font-family="monospace" fill="currentColor">➜ ${left} out</text>`;
    const banner =
      diff === 0
        ? `✅ BALANCED: both sides pump ${right} L/min, so nothing builds up.`
        : diff > 0
        ? `⚠️ LUNGS BACKING UP: ${right} L/min goes in, only ${left} L/min comes out, so ${diff} L/min builds up in the lungs.`
        : `⚠️ BODY VEINS BACKING UP: the right side only takes ${right} L/min, but the left sends out ${left}, so ${-diff} L/min waits in the body's veins.`;
    return { svg: svgWrap(inner, "Right pump to lungs, left pump to body"), banner };
  }

  // loop: full double loop per minute
  const rate = d1;
  const perBeat = d2;
  const litres = (rate * perBeat) / 1000;
  const speed = Math.max(0.15, 60 / rate) * 0.5;
  const inner = `
    <ellipse cx="180" cy="58" rx="110" ry="30" fill="none" stroke="${C.blue}" stroke-width="4" stroke-dasharray="8 6" style="animation: flowRight ${speed.toFixed(2)}s linear infinite"/>
    <ellipse cx="180" cy="150" rx="150" ry="36" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="8 6" style="animation: flowLeft ${speed.toFixed(2)}s linear infinite"/>
    <text x="180" y="16" text-anchor="middle" font-size="10" font-family="monospace" fill="${C.blue}" font-weight="bold">🫁 LUNG LOOP (short)</text>
    <text x="180" y="204" text-anchor="middle" font-size="10" font-family="monospace" fill="${C.red}" font-weight="bold">🧍 BODY LOOP (long)</text>
    <circle cx="180" cy="104" r="30" fill="${C.red}" fill-opacity="0.85"/>
    <text x="180" y="101" text-anchor="middle" font-size="10" font-family="monospace" fill="#fff" font-weight="bold">${rate}</text>
    <text x="180" y="114" text-anchor="middle" font-size="8" font-family="monospace" fill="#fff">beats/min</text>
    <text x="300" y="100" text-anchor="middle" font-size="18" font-family="monospace" fill="currentColor" font-weight="bold">${litres.toFixed(1)} L</text>
    <text x="300" y="116" text-anchor="middle" font-size="9" font-family="sans-serif" fill="currentColor">per minute</text>
    <text x="60" y="108" text-anchor="middle" font-size="9" font-family="monospace" fill="currentColor">${perBeat} mL/beat</text>`;
  const banner = `💓 ${rate} beats × ${perBeat} mL = ${(rate * perBeat).toLocaleString("en-US")} mL = ${litres.toFixed(1)} L of blood round both loops every minute.`;
  return { svg: svgWrap(inner, "The double loop: lungs and body"), banner };
}

// ============================================================================
// MULTIPLY BY 11 — the ×10 + ×1 stack (column addition)
// ============================================================================
function digitsRow(numStr, rightX, y, color, size = 24, colW = 22) {
  // Right-aligned digits, one per column, so columns line up across rows.
  return [...numStr]
    .reverse()
    .map((ch, i) => `<text x="${rightX - i * colW}" y="${y}" text-anchor="middle" font-size="${size}" font-family="monospace" fill="${color}" font-weight="bold">${ch}</text>`)
    .join("");
}

function renderTimesEleven(spec, d1, d2) {
  const layer = spec.layer;
  const colW = 24;
  const rightX = 150;

  let n;
  let k;
  if (layer === "split") {
    n = d1;
    k = d2;
  } else {
    n = d1 * 10 + d2;
    k = 1;
  }
  const top = n * 10;
  const bottom = n * k;
  const answer = top + bottom;

  // Column-by-column carries for the addition top + bottom.
  const tStr = String(top);
  const bStr = String(bottom);
  const width = Math.max(tStr.length, bStr.length);
  const carries = [];
  let carry = 0;
  for (let i = 0; i < width; i++) {
    const s = Number(tStr[tStr.length - 1 - i] || 0) + Number(bStr[bStr.length - 1 - i] || 0) + carry;
    carry = s >= 10 ? 1 : 0;
    carries.push(carry);
  }

  let inner = `
    <text x="20" y="30" font-size="10" font-family="monospace" fill="currentColor" opacity="0.7">${n} × 10</text>
    ${digitsRow(tStr, rightX, 46, C.blue, 24, colW)}
    <text x="20" y="80" font-size="10" font-family="monospace" fill="currentColor" opacity="0.7">${n} × ${k}</text>
    <text x="${rightX - width * colW - 4}" y="80" font-size="22" font-family="monospace" fill="currentColor">+</text>
    ${digitsRow(bStr, rightX, 80, C.amber, 24, colW)}
    <line x1="${rightX - width * colW - 10}" y1="92" x2="${rightX + 14}" y2="92" stroke="currentColor" stroke-width="2"/>
    ${digitsRow(String(answer), rightX, 122, C.green, 26, colW)}`;

  // Carry marks above the columns that received a carry.
  carries.forEach((c, i) => {
    if (c) {
      const x = rightX - (i + 1) * colW;
      inner += `<text x="${x}" y="14" text-anchor="middle" font-size="12" font-family="monospace" fill="${C.red}" font-weight="bold">¹</text>`;
    }
  });

  let banner;
  if (layer === "split") {
    inner += `
      <text x="200" y="40" font-size="11" font-family="monospace" fill="currentColor" font-weight="bold">${n} × ${10 + k}</text>
      <text x="200" y="62" font-size="10.5" font-family="monospace" fill="currentColor">= ${n} × 10 + ${n} × ${k}</text>
      <text x="200" y="84" font-size="10.5" font-family="monospace" fill="currentColor">= ${top} + ${bottom}</text>
      <text x="200" y="112" font-size="18" font-family="monospace" fill="${C.green}" font-weight="bold">= ${answer}</text>
      ${k > 1 ? `<text x="200" y="140" font-size="9" font-family="sans-serif" fill="${C.amber}">Bottom row is ${n} × ${k}, not just ${n}</text>` : `<text x="200" y="140" font-size="9" font-family="sans-serif" fill="currentColor" opacity="0.7">×11: bottom row is the number itself</text>`}`;
    banner = `🧮 SPLIT: ${n} × ${10 + k} = ${n} × 10 + ${n} × ${k} = ${top} + ${bottom} = ${answer}.`;
  } else {
    const a = d1;
    const b = d2;
    const s = a + b;
    const carried = s >= 10;
    inner += `
      <text x="200" y="36" font-size="10" font-family="monospace" fill="currentColor" font-weight="bold">SHORTCUT</text>
      <text x="200" y="64" font-size="20" font-family="monospace" fill="currentColor" font-weight="bold">${a} │ ${s} │ ${b}</text>
      <text x="200" y="84" font-size="9.5" font-family="monospace" fill="currentColor">middle = ${a} + ${b} = ${s}</text>
      ${
        carried
          ? `<text x="200" y="106" font-size="9.5" font-family="monospace" fill="${C.red}" font-weight="bold">${s} ≥ 10: write ${s - 10}, carry 1</text>
             <text x="200" y="124" font-size="9.5" font-family="monospace" fill="${C.red}">front ${a} + 1 = ${a + 1}</text>`
          : `<text x="200" y="106" font-size="9.5" font-family="monospace" fill="${C.green}">no carry needed</text>`
      }
      <text x="200" y="150" font-size="18" font-family="monospace" fill="${C.green}" font-weight="bold">= ${answer}</text>`;
    banner = carried
      ? `🔁 CARRY: ${n} × 11 → middle ${a} + ${b} = ${s} → write ${s - 10}, carry 1 onto ${a} → ${answer}.`
      : `✅ ${n} × 11 = ${top} + ${n}: ends ${a} … ${b}, middle ${a} + ${b} = ${s} → ${answer}.`;
  }

  return { svg: svgWrap(inner, `${n} times ${layer === "split" ? 10 + k : 11}`), banner };
}

// ============================================================================
// Registry
// ============================================================================
const RENDERERS = {
  avp_rectangle_grid: renderRectangle,
  heart_pump: renderHeart,
  times_eleven: renderTimesEleven
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

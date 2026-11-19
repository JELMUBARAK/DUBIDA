/**
 * How the Heart Pumps Blood: one double pump in a double loop.
 * Drawings for one topic, built with the shared visual kit (../visual-kit.js).
 * UNIT_RENDERERS:  object_spec.type  -> (spec, dial1, dial2) => { svg, banner }
 * SCENE_RENDERERS: scene.toy.visual  -> ({ last, tried }) => svg   (last = option index or null)
 */

import { PALETTE as P, frame, sceneFrame, flow, beat, chip, stat, stackBar, tank, leaflet, caption as kitCaption, emoji } from "../visual-kit.js";



// ============================================================================
// HEART — one double pump in a double loop (built with the visual kit)
// ============================================================================
const sideLabel = (x, y, text) => kitCaption(x, y, text);

/** One heart chamber shaped like half a heart, centred on (cx, cy). */
function chamber(cx, cy, fill) {
  return `<path d="M${cx - 26},${cy - 16} C${cx - 26},${cy - 30} ${cx - 12},${cy - 34} ${cx},${cy - 28} C${cx + 12},${cy - 34} ${cx + 26},${cy - 28} ${cx + 26},${cy - 14} C${cx + 26},${cy + 8} ${cx + 10},${cy + 24} ${cx},${cy + 32} C${cx - 12},${cy + 22} ${cx - 26},${cy + 6} ${cx - 26},${cy - 16} Z"
    fill="${fill}" stroke="${P.redDeep}" stroke-opacity="0.5" stroke-width="2" filter="url(#vk-shadow)"/>`;
}

function renderHeart(spec, d1, d2) {
  const layer = spec.layer;

  if (layer === "valves") {
    const seal = d1;
    const amount = [40, 55, 70][d2 - 1];
    const forward = Math.round(amount * [0.6, 0.8, 1][seal]);
    const back = amount - forward;
    const gap = [18, 8, 0][seal];
    const period = 1.1;
    const outPath = "M132,92 C150,70 150,34 180,30 L352,30";
    const inner = `
      <!-- artery tube, out to the body -->
      <path d="${outPath}" fill="none" stroke="${P.redDeep}" stroke-opacity="0.35" stroke-width="18" stroke-linecap="round"/>
      <path d="${outPath}" fill="none" stroke="#fee2e2" stroke-width="13" stroke-linecap="round"/>
      ${flow(outPath, { color: P.red, count: Math.max(2, Math.round(forward / 9)), dur: 2.6 - d2 * 0.35, r: 3.6, track: false })}
      <text x="352" y="14" text-anchor="end" font-size="9" font-weight="600" fill="currentColor" opacity="0.7">artery → out to the body</text>

      <!-- ventricle squeezes; atrium sits on top -->
      ${beat(`<path d="M60,84 C52,120 72,168 105,198 C138,168 158,120 150,84 Z" fill="url(#vk-red)" stroke="${P.redDeep}" stroke-width="2.5"/>`, { period, depth: 0.04 + d2 * 0.035, origin: "center top" })}
      <path d="M62,74 C52,48 60,16 92,14 C104,13 112,19 120,15 C146,9 158,42 148,74 Z" fill="url(#vk-red)" fill-opacity="0.6" stroke="${P.redDeep}" stroke-width="2"/>

      <!-- blood: atrium fills the ventricle; a leaky valve lets some back up -->
      ${flow("M98,26 L98,150", { color: "#fff", count: 3, dur: 1.6, r: 2.6, track: false })}
      ${back > 0 ? flow("M114,160 L114,30", { color: P.amber, count: Math.max(1, Math.round(back / 6)), dur: 1.4, r: 3.4, track: false }) : ""}

      <!-- valve leaflets: snap shut on every squeeze -->
      ${leaflet(60, 79, 105 - gap / 2, 86, { period, openDeg: 62 })}
      ${leaflet(150, 79, 105 + gap / 2, 86, { period, openDeg: -62 })}
      ${gap > 0 ? `<circle cx="105" cy="86" r="${gap / 2 + 3}" fill="none" stroke="${P.amber}" stroke-width="1.5" stroke-dasharray="3 2"/>` : ""}

      ${sideLabel(4, 42, "ATRIUM")}
      ${sideLabel(4, 90, "VALVE")}
      ${sideLabel(4, 150, "VENTRICLE")}

      <!-- readout -->
      ${chip(276, 62, ["Valve: leaky", "Valve: partly leaky", "Valve: sealed"][seal], { tone: ["bad", "warn", "ok"][seal], size: 10.5 })}
      ${stat(206, 106, `${forward} mL`, "goes forward to the body", { color: P.green })}
      ${stat(206, 146, `${back} mL`, "leaks back into the atrium", { color: back > 0 ? P.amber : P.slate })}
      ${stackBar(206, 172, 140, 11, [{ value: forward, color: P.green }, { value: back, color: P.amber }], amount)}
      <text x="206" y="198" font-size="9.5" fill="currentColor" opacity="0.7">Each squeeze pushes ${amount} mL</text>`;
    const banner =
      back > 0
        ? `⚠️ LEAKY VALVE: of ${amount} mL squeezed, ${back} mL leaks back into the atrium and only ${forward} mL goes forward.`
        : `✅ SEALED VALVE: all ${amount} mL goes forward, nothing leaks back.`;
    return { svg: frame(inner, "One side of the heart: atrium, valve, ventricle, artery"), banner };
  }

  if (layer === "two_sides") {
    const right = d1;
    const left = d2;
    const diff = right - left;
    const lungsBuild = diff > 0 ? diff : 0;
    const bodyBuild = diff < 0 ? -diff : 0;
    const period = 0.95;
    const dur = 2.4;
    // Fluid that backs up pools in the bottom of each lung (clipped to the lung's shape).
    const lobe = cx => {
      const id = `vk-lobe-${cx}`;
      const level = lungsBuild ? 67 - lungsBuild * 7 : 0;
      return `<clipPath id="${id}"><ellipse cx="${cx}" cy="40" rx="44" ry="27"/></clipPath>
        <ellipse cx="${cx}" cy="40" rx="44" ry="27" fill="url(#vk-lung)" fill-opacity="${0.75 + lungsBuild * 0.05}"/>
        ${lungsBuild ? `<rect x="${cx - 44}" y="${level}" width="88" height="${67 - level}" fill="${P.blue}" fill-opacity="0.5" clip-path="url(#${id})"/>` : ""}`;
    };
    const inner = `
      <!-- lungs -->
      <path d="M180,4 L180,22 M180,22 L150,34 M180,22 L210,34" stroke="${P.slate}" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round" fill="none"/>
      ${beat(lobe(128), { period: 3.2, depth: -0.04 - lungsBuild * 0.02 })}
      ${beat(lobe(232), { period: 3.2, depth: -0.04 - lungsBuild * 0.02 })}
      ${chip(180, 46, lungsBuild ? `🫁 +${lungsBuild} L/min backing up` : "🫁 Lungs: balanced", { tone: lungsBuild ? "warn" : "ok", size: 9.5 })}

      <!-- the four flows: blue = needs oxygen, red = full of oxygen -->
      ${flow("M128,106 C96,100 86,80 100,62", { color: P.blue, count: right, dur })}
      ${flow("M260,62 C274,80 266,100 232,106", { color: P.red, count: left, dur })}
      ${flow("M232,138 C284,146 292,178 246,190", { color: P.red, count: left, dur })}
      ${flow("M114,190 C68,178 76,146 128,138", { color: P.blue, count: right, dur })}

      <!-- the two pumps, beating together -->
      ${beat(chamber(152, 118, "url(#vk-blue)") + chamber(208, 118, "url(#vk-red)"), { period, depth: 0.08 })}
      ${chip(146, 160, `Right ${right} L/min`, { tone: "info", size: 9.5, anchor: "end" })}
      ${chip(214, 160, `Left ${left} L/min`, { tone: "bad", size: 9.5, anchor: "start" })}
      ${sideLabel(8, 98, "TO LUNGS")}
      ${sideLabel(300, 98, "FROM LUNGS")}

      <!-- body -->
      <rect x="92" y="178" width="176" height="28" rx="14" fill="${bodyBuild ? P.amber : P.redSoft}" fill-opacity="${bodyBuild ? 0.25 + bodyBuild * 0.1 : 0.45}" stroke="${bodyBuild ? P.amber : P.red}" stroke-opacity="0.6"/>
      <text x="180" y="196" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">${bodyBuild ? `🧍 Body veins: +${bodyBuild} L/min waiting` : "🧍 Body: balanced"}</text>`;
    const banner =
      diff === 0
        ? `✅ BALANCED: both sides pump ${right} L/min, so nothing builds up.`
        : diff > 0
        ? `⚠️ LUNGS BACKING UP: ${right} L/min goes in, only ${left} L/min comes out, so ${diff} L/min builds up in the lungs.`
        : `⚠️ BODY VEINS BACKING UP: the right side only takes ${right} L/min, but the left sends out ${left}, so ${-diff} L/min waits in the body's veins.`;
    return { svg: frame(inner, "Right pump to lungs, left pump to body"), banner };
  }

  // loop: full double loop per minute
  const rate = d1;
  const perBeat = d2;
  const litres = (rate * perBeat) / 1000;
  const dur = (4 * 70) / rate;
  const lungLoop = "M150,82 C108,82 84,70 84,52 C84,34 108,24 150,24 C192,24 216,34 216,52 C216,70 192,82 150,82";
  const bodyLoop = "M150,136 C98,136 56,148 56,166 C56,186 98,198 150,198 C202,198 244,186 244,166 C244,148 202,136 150,136";
  const inner = `
    ${flow(lungLoop, { color: P.blue, count: 7, dur: dur * 0.6, trackWidth: 10 })}
    ${flow(bodyLoop, { color: P.red, count: 10, dur, trackWidth: 10 })}
    ${chip(150, 24, "🫁 Lungs", { size: 9.5 })}
    ${chip(150, 198, "🧍 Body", { size: 9.5 })}
    ${beat(`<path d="M150,138 C108,112 100,82 122,72 C136,66 146,74 150,82 C154,74 164,66 178,72 C200,82 192,112 150,138 Z" fill="url(#vk-red)" stroke="${P.redDeep}" stroke-width="2" filter="url(#vk-shadow)"/>`, { period: 60 / rate, depth: 0.1 })}
    <text x="150" y="106" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${rate}</text>
    <text x="150" y="118" text-anchor="middle" font-size="7.5" font-weight="600" fill="#fff">beats/min</text>

    ${stat(6, 112, `${perBeat} mL`, "per beat", { size: 16 })}
    ${stat(300, 22, `${litres.toFixed(1)} L`, "every minute", { size: 18, anchor: "middle" })}
    ${tank(276, 46, 48, 140, litres / 18, P.red, { label: "max 18 L" })}`;
  const banner = `💓 ${rate} beats × ${perBeat} mL = ${(rate * perBeat).toLocaleString("en-US")} mL = ${litres.toFixed(1)} L of blood round both loops every minute.`;
  return { svg: frame(inner, "The double loop: lungs and body"), banner };
}

export const UNIT_RENDERERS = {
  heart_pump: renderHeart
};

// ============================================================================
// MYSTERY SCENES (220 × 120). `last` = option just tapped (null = not yet), `tried` = all tapped.
// ============================================================================
const caption = (x, y, text, opacity = 0.6) => kitCaption(x, y, text, { anchor: "middle", opacity });
const blocked = (x, y) =>
  `<g><circle cx="${x}" cy="${y}" r="9" fill="${P.red}"/><path d="M${x - 4},${y - 4} L${x + 4},${y + 4} M${x + 4},${y - 4} L${x - 4},${y + 4}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`;

/** A flap hinged at (hx, hy) hanging down `len`; swings to `deg` once (one-shot, stays there). */
function flap(hx, hy, len, deg, color = P.slate) {
  const rot = deg ? `<animateTransform attributeName="transform" type="rotate" from="0 ${hx} ${hy}" to="${deg} ${hx} ${hy}" dur="0.45s" fill="freeze"/>` : "";
  return `<g>${rot}<rect x="${hx - 3}" y="${hy}" width="6" height="${len}" rx="3" fill="${color}"/></g>`;
}

function sceneCatFlap({ last }) {
  const out = last === 0;
  const inBlocked = last === 1;
  const inner = `
    <rect x="0" y="104" width="220" height="16" fill="${P.slate}" fill-opacity="0.15"/>
    <rect x="104" y="6" width="12" height="98" rx="3" fill="${P.slate}" fill-opacity="0.35"/>
    <rect x="98" y="52" width="24" height="52" rx="6" fill="var(--card)" stroke="${P.slate}" stroke-width="2"/>
    ${flap(110, 56, 44, out ? -70 : 0, P.amber)}
    ${caption(52, 16, "INSIDE")}${caption(168, 16, "OUTSIDE")}
    ${out ? flow("M60,92 L180,92", { color: P.green, count: 3, dur: 1.4, r: 2.6 }) + emoji(178, 98, "🐈") : emoji(52, 98, "🐈")}
    ${inBlocked ? flow("M170,80 L128,80", { color: P.red, count: 3, dur: 1.1, r: 2.6 }) + blocked(140, 62) + emoji(180, 98, "🦊", 20) : ""}
    ${last === null ? chip(110, 40, "Push it which way?", { size: 9 }) : ""}`;
  return sceneFrame(inner, "Cat flap: it only swings one way");
}

function sceneBikePump({ last }) {
  const push = last === 0;
  const lift = last === 1;
  const inner = `
    <!-- pump -->
    <rect x="26" y="${push ? 52 : 34}" width="6" height="${push ? 22 : 40}" fill="${P.slate}"/>
    <rect x="12" y="${push ? 46 : 28}" width="34" height="8" rx="4" fill="${P.slate}"/>
    <rect x="18" y="64" width="22" height="44" rx="5" fill="${P.blueSoft}" stroke="${P.blue}" stroke-width="2"/>
    <path d="M40,96 C70,96 80,70 112,70" fill="none" stroke="${P.slate}" stroke-width="5" stroke-linecap="round"/>
    <!-- valve -->
    <rect x="110" y="62" width="16" height="16" rx="4" fill="var(--card)" stroke="${lift ? P.green : P.slate}" stroke-width="2"/>
    ${lift ? `<path d="M113,70 L123,70" stroke="${P.green}" stroke-width="3" stroke-linecap="round"/>` : ""}
    <!-- tyre -->
    <circle cx="172" cy="66" r="40" fill="none" stroke="#334155" stroke-width="12"/>
    <circle cx="172" cy="66" r="18" fill="none" stroke="${P.slate}" stroke-width="2"/>
    ${push ? flow("M40,96 C70,96 80,70 118,70 L150,66", { color: P.blue, count: 5, dur: 1.2, r: 2.6, track: false }) : ""}
    ${lift ? flow("M150,66 L130,70", { color: P.slate, count: 2, dur: 0.9, r: 2.2, track: false }) + blocked(118, 48) + chip(172, 104, "Air stays in", { tone: "ok", size: 9 }) : ""}
    ${push ? chip(172, 104, "Air goes in", { tone: "info", size: 9 }) : ""}
    ${last === null ? chip(80, 18, "Push, then lift", { size: 9 }) : ""}`;
  return sceneFrame(inner, "Bike tyre valve: air in, never back out");
}

function sceneSoap({ last }) {
  const press = last === 0;
  const refill = last === 1;
  const chamberH = press ? 14 : 26;
  const inner = `
    <rect x="70" y="${press ? 16 : 8}" width="44" height="8" rx="4" fill="${P.slate}"/>
    <rect x="${press ? 106 : 106}" y="${press ? 18 : 10}" width="34" height="6" rx="3" fill="${P.slate}"/>
    <rect x="88" y="${press ? 24 : 16}" width="8" height="${press ? 12 : 20}" fill="${P.slate}"/>
    <!-- pump chamber -->
    <rect x="80" y="36" width="24" height="${chamberH}" rx="5" fill="${P.green}" fill-opacity="0.35" stroke="${P.green}" stroke-width="2"/>
    <!-- bottle -->
    <rect x="62" y="62" width="60" height="52" rx="10" fill="${P.green}" fill-opacity="0.18" stroke="${P.slate}" stroke-width="2"/>
    <rect x="65" y="78" width="54" height="33" rx="7" fill="${P.green}" fill-opacity="0.45"/>
    <line x1="92" y1="${36 + chamberH}" x2="92" y2="104" stroke="${P.slate}" stroke-width="2" stroke-dasharray="3 2"/>
    ${press ? flow("M140,24 C156,28 162,46 164,70", { color: P.green, count: 4, dur: 0.9, r: 3, track: false }) + chip(176, 104, "Squirt!", { tone: "ok", size: 9 }) : ""}
    ${refill ? flow("M92,104 L92,48", { color: P.green, count: 4, dur: 1.2, r: 2.6, track: false }) + chip(166, 60, "Refills from below", { tone: "info", size: 9 }) : ""}
    ${last === null ? chip(166, 60, "Press, then let go", { size: 9 }) : ""}`;
  return sceneFrame(inner, "Soap dispenser: squeeze out, spring back, refill");
}

function sceneBottle({ last }) {
  const squeeze = last === 0;
  const relax = last === 1;
  const w = squeeze ? 34 : 54;
  const x = 80 - w / 2;
  const inner = `
    <rect x="72" y="14" width="16" height="16" rx="3" fill="${P.slate}"/>
    <path d="M${x},40 Q${x},30 ${x + 10},30 L${x + w - 10},30 Q${x + w},30 ${x + w},40 L${x + w},104 Q${x + w},112 ${x + w - 8},112 L${x + 8},112 Q${x},112 ${x},104 Z"
      fill="${P.blue}" fill-opacity="0.2" stroke="${P.blue}" stroke-width="2.5"/>
    <rect x="${x + 3}" y="${squeeze ? 46 : 62}" width="${w - 6}" height="${squeeze ? 63 : 47}" rx="6" fill="${P.blue}" fill-opacity="0.5"/>
    ${squeeze ? `${emoji(x - 12, 76, "✊", 16)}${emoji(x + w + 12, 76, "✊", 16)}` + flow("M80,12 C96,-4 140,4 186,40", { color: P.blue, count: 5, dur: 0.8, r: 2.8, track: false }) + chip(170, 100, "Water shoots out", { tone: "info", size: 9 }) : ""}
    ${relax ? flow("M150,8 C120,6 96,6 82,22", { color: P.slate, count: 4, dur: 1.2, r: 2.4, track: false }) + chip(166, 100, "Sucks in to refill", { tone: "ok", size: 9 }) : ""}
    ${last === null ? chip(160, 60, "Squeeze, then relax", { size: 9 }) : ""}`;
  return sceneFrame(inner, "Squeeze bottle: smaller space pushes out, bigger space sucks in");
}

/** Two loops from one hub: a short loop (left) and a long loop round the edge. */
function twoLoops({ last, tried }, { hub, shortEnd, longStops, shortColor, longColor, mover, title }) {
  const shortLoop = "M110,62 C86,40 46,36 34,54 C24,72 70,80 110,62";
  const longLoop = "M110,62 C140,18 206,18 208,58 C210,100 150,112 110,96 C88,88 96,72 110,62";
  const shortOn = last === 0;
  const longOn = last === 1;
  const seen = k => tried.includes(k);
  const inner = `
    <path d="${shortLoop}" fill="none" stroke="${shortColor}" stroke-opacity="${seen(0) ? 0.55 : 0.18}" stroke-width="5" stroke-linecap="round"/>
    <path d="${longLoop}" fill="none" stroke="${longColor}" stroke-opacity="${seen(1) ? 0.55 : 0.18}" stroke-width="5" stroke-linecap="round"/>
    ${shortOn ? flow(shortLoop, { color: shortColor, count: 1, dur: 2.2, r: 6, track: false }) : ""}
    ${longOn ? flow(longLoop, { color: longColor, count: 1, dur: 4.2, r: 6, track: false }) : ""}
    ${emoji(34, 50, shortEnd, 16)}
    ${longStops.map(([sx, sy, ch]) => emoji(sx, sy, ch, 13)).join("")}
    <circle cx="110" cy="62" r="13" fill="var(--card)" stroke="currentColor" stroke-opacity="0.5" stroke-width="2"/>
    ${emoji(110, 68, hub, 14)}
    ${shortOn ? chip(50, 100, "Short loop", { tone: "ok", size: 9 }) : ""}
    ${longOn ? chip(160, 106, "Long loop", { tone: "info", size: 9 }) : ""}
    ${last === null ? chip(110, 104, `Ride both ${mover}`, { size: 9 }) : ""}`;
  return sceneFrame(inner, title);
}

const sceneTrains = s =>
  twoLoops(s, {
    hub: "🚉",
    shortEnd: "✈️",
    longStops: [[150, 30, "🏢"], [200, 52, "🏫"], [184, 96, "🏥"], [134, 104, "🏬"]],
    shortColor: P.green,
    longColor: P.blue,
    mover: "lines",
    title: "Two train lines from one central station"
  });

const sceneVan = s =>
  twoLoops(s, {
    hub: "🏭",
    shortEnd: "📦",
    longStops: [[150, 30, "🏠"], [200, 52, "🏠"], [184, 96, "🏘️"], [134, 104, "🏠"]],
    shortColor: P.amber,
    longColor: P.red,
    mover: "runs",
    title: "One van, two round trips from the depot"
  });

export const SCENE_RENDERERS = {
  heart_catflap: sceneCatFlap,
  heart_bikepump: sceneBikePump,
  heart_soap: sceneSoap,
  heart_bottle: sceneBottle,
  heart_trains: sceneTrains,
  heart_van: sceneVan
};

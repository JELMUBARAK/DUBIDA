/**
 * Thinking, Learning & Understanding: one STM ↔ Bridge ↔ LTM pipeline.
 * Drawings for one topic, built with the shared visual kit (../visual-kit.js).
 * UNIT_RENDERERS:  object_spec.type  -> (spec, dial1, dial2) => { svg, banner }
 * SCENE_RENDERERS: scene.toy.visual  -> ({ last, tried }) => svg   (last = option index or null)
 */

import { PALETTE as P, frame, sceneFrame, flow, beat, chip, stat, stackBar, tank, caption, drawIn } from "../visual-kit.js";

// ---------------------------------------------------------------- local helpers

/** Small spaced-out caption (same style as the heart's side labels). */
const cap = (x, y, text, anchor = "start") => caption(x, y, text, { anchor });

/** A rounded card: a slot, a brick or a box. kind: idea | ping | ok | warn | empty | soft */
function card(x, y, w, h, kind, top = "", bottom = "") {
  const fills = {
    idea: `fill="url(#vk-blue)" stroke="${P.blueDeep}"`,
    ping: `fill="url(#vk-red)" stroke="${P.redDeep}"`,
    ok: `fill="${P.green}" fill-opacity="0.9" stroke="#047857"`,
    warn: `fill="${P.amber}" fill-opacity="0.9" stroke="#b45309"`,
    empty: `fill="${P.grid}" fill-opacity="0.08" stroke="${P.grid}" stroke-dasharray="4 3"`,
    soft: `fill="${P.grid}" fill-opacity="0.12" stroke="${P.grid}" stroke-opacity="0.6"`
  };
  const solid = kind === "idea" || kind === "ping" || kind === "ok" || kind === "warn";
  const ink = solid ? `fill="#fff"` : `fill="currentColor" opacity="0.6"`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" ${fills[kind]} stroke-width="1.5" ${solid ? 'filter="url(#vk-shadow)"' : ""}/>
    ${top ? `<text x="${x + w / 2}" y="${y + h / 2 - (bottom ? 2 : -4)}" text-anchor="middle" font-size="13">${top}</text>` : ""}
    ${bottom ? `<text x="${x + w / 2}" y="${y + h / 2 + 12}" text-anchor="middle" font-size="8" font-weight="700" ${ink}>${bottom}</text>` : ""}`;
}

/** A small side-to-side wiggle (a buzzing phone). */
const buzz = (inner, cx, cy) =>
  `<g>${inner}<animateTransform attributeName="transform" type="rotate" dur="0.35s" repeatCount="indefinite" values="0 ${cx} ${cy};-6 ${cx} ${cy};6 ${cx} ${cy};0 ${cx} ${cy}"/></g>`;

/** Something knocked off: falls, tips over and fades, then repeats. */
const knockedOff = (inner, cx, cy, delay = 0) =>
  `<g opacity="0">${inner}
    <animateTransform attributeName="transform" type="translate" dur="2.4s" begin="${delay}s" repeatCount="indefinite" values="0 0;0 0;0 46" keyTimes="0;0.25;1"/>
    <animate attributeName="opacity" dur="2.4s" begin="${delay}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;0.3;1"/></g>`;

/** A path that draws itself in once (stroke animation). */

/** A dashed, broken bridge between two points with a label chip. */
const brokenBridge = (x1, y, x2, label) =>
  `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${P.red}" stroke-width="3" stroke-dasharray="5 5" stroke-linecap="round" opacity="0.8"/>
   ${chip((x1 + x2) / 2, y - 16, label, { tone: "bad", size: 8.5 })}`;

// ============================================================================
// UNIT 1 · the 4-slot working-memory desk
// ============================================================================
function renderWorkbench(spec, ideas, pings) {
  const total = ideas + pings;
  const overflow = total > 4;
  const slotItems = [];
  for (let i = 0; i < pings; i++) slotItems.push({ type: "ping", label: `📱Ping${i + 1}` });
  for (let i = 0; i < ideas; i++) slotItems.push({ type: "idea", label: `🧩Idea${i + 1}` });
  const onDesk = slotItems.slice(0, 4);
  const dropped = slotItems.slice(4);

  const slots = [0, 1, 2, 3]
    .map(i => {
      const x = 18 + i * 46;
      const it = onDesk[i];
      if (!it) return card(x, 50, 40, 42, "empty", "", "free");
      const c = card(x, 50, 40, 42, it.type, it.type === "ping" ? "📱" : "🧩", it.type === "ping" ? `Ping ${it.label.slice(-1)}` : `Idea ${it.label.slice(-1)}`);
      return it.type === "ping" ? buzz(c, x + 20, 71) : c;
    })
    .join("");

  const fallen = dropped
    .map((d, i) => knockedOff(card(60 + i * 46, 104, 40, 30, "idea", "", `Idea ${d.label.slice(-1)}`), 80 + i * 46, 119, i * 0.4))
    .join("");

  const bridgePath = "M208,72 C236,72 252,96 286,96";
  const inner = `
    ${chip(102, 24, "🧠 Working memory · 4 slots", { size: 9.5 })}
    ${slots}
    <!-- the desk -->
    <rect x="10" y="96" width="194" height="9" rx="4" fill="${P.slate}"/>
    <rect x="22" y="105" width="7" height="44" fill="${P.slate}" opacity="0.8"/>
    <rect x="185" y="105" width="7" height="44" fill="${P.slate}" opacity="0.8"/>
    ${fallen}

    <!-- encoding bridge to long-term memory -->
    ${
      overflow
        ? brokenBridge(212, 96, 284, "✖ blocked")
        : flow(bridgePath, { color: P.blue, count: Math.max(2, ideas), dur: 1.8, r: 3.4 })
    }
    ${!overflow ? cap(246, 70, "ENCODING", "middle") : ""}
    ${tank(292, 46, 54, 104, overflow ? 0 : Math.min(1, ideas / 6), P.green, { label: "Long-term memory" })}
    <text x="319" y="104" text-anchor="middle" font-size="10" font-weight="800" style="fill:${overflow ? P.red : P.green}">${overflow ? "0% saved" : "Saving"}</text>

    ${
      overflow
        ? chip(180, 194, `💥 ${total}/4 slots · ${dropped.length} idea${dropped.length > 1 ? "s" : ""} dropped`, { tone: "bad", size: 10 })
        : chip(180, 194, `✓ ${total}/4 slots · stable`, { tone: "ok", size: 10 })
    }`;
  const banner = overflow
    ? `⚠️ STM OVERFLOW (${total}/4 slots): ${pings} Ping(s) steal slots on the workbench, dropping ${dropped.length} idea(s) before reaching LTM!`
    : `✅ WORKBENCH STABLE (${total}/4 slots): Ideas stay on the STM desk long enough to cross the Encoding Bridge into LTM.`;
  return { svg: frame(inner, `Working memory desk: ${ideas} ideas, ${pings} pings`), banner };
}

// ============================================================================
// UNIT 2 · loose fact bricks vs a "why"-linked arch
// ============================================================================
function arch(built) {
  const stones = `<rect x="234" y="120" width="30" height="62" rx="4"/><rect x="318" y="120" width="30" height="62" rx="4"/>
    <path d="M234,122 C234,62 348,62 348,122 L318,122 C318,96 264,96 264,122 Z"/>`;
  if (!built) {
    return `<g fill="none" stroke="${P.grid}" stroke-width="2" stroke-dasharray="5 4">${stones}</g>`;
  }
  return `<g fill="url(#vk-blue)" stroke="${P.green}" stroke-width="2.5" filter="url(#vk-shadow)">${stones}
      <animateTransform attributeName="transform" type="translate" from="0 18" to="0 0" dur="0.6s" fill="freeze"/>
      <animate attributeName="opacity" from="0" to="1" dur="0.6s" fill="freeze"/></g>
    <polygon points="281,58 301,58 297,76 285,76" fill="${P.green}" stroke="#047857" stroke-width="1.5"/>`;
}

function renderArchChunk(spec, bricks, links) {
  const isLockedArch = bricks >= 4 && links >= 3;
  const missingBase = bricks < 4;

  const desk = isLockedArch
    ? card(22, 46, 98, 34, "ok", "", "📦 1 chunk = 4 facts") +
      [1, 2, 3].map(i => card(22, 46 + i * 37, 98, 31, "empty", "", "free slot")).join("")
    : `<g class="shake-active">${Array.from({ length: Math.min(4, bricks) })
        .map((_, i) => card(22, 46 + i * 37, 98, 31, "warn", "", `🧱 Fact ${i + 1}`))
        .join("")}</g>`;

  const linkIcons = Array.from({ length: 4 })
    .map((_, i) => `<text x="${150 + i * 18}" y="152" text-anchor="middle" font-size="12" opacity="${i < links ? 1 : 0.2}">🔗</text>`)
    .join("");

  const inner = `
    ${chip(71, 22, "🧠 Working memory", { size: 9.5 })}
    <rect x="14" y="38" width="114" height="160" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5"/>
    ${desk}
    ${!isLockedArch ? cap(71, 196, "UNLINKED · FADING", "middle") : ""}

    <!-- the bridge -->
    ${
      isLockedArch
        ? flow("M134,78 C164,70 196,70 226,82", { color: P.green, count: 4, dur: 1.6, r: 3.4 }) +
          flow("M226,128 C196,138 164,138 134,128", { color: P.blue, count: 3, dur: 1.9, r: 3.2 }) +
          cap(180, 64, "WHY-LINKS", "middle") +
          cap(180, 124, "1 CHUNK BACK", "middle")
        : brokenBridge(136, 100, 224, "🔒 bridge closed")
    }
    ${linkIcons}
    <text x="177" y="170" text-anchor="middle" font-size="9" font-weight="600" fill="currentColor" opacity="0.7">${links} "why" link${links === 1 ? "" : "s"}</text>

    <!-- long-term memory -->
    ${chip(291, 22, "🏛️ Long-term memory", { size: 9.5 })}
    ${arch(isLockedArch)}
    ${
      isLockedArch
        ? chip(291, 196, "✓ Arch locked in", { tone: "ok", size: 9.5 })
        : chip(291, 196, missingBase ? "⚠️ Needs 4+ facts" : "🏚️ Add why-links", { tone: "warn", size: 9.5 })
    }`;
  const banner = isLockedArch
    ? `✅ STM → LTM ARCH ENCODED (${bricks} Facts + ${links} 'Why' Links): Locked into LTM & compressed into 1 STM Chunk slot (3 STM slots freed)!`
    : missingBase
    ? `⚠️ MISSING BASE FACTS (${bricks} Bricks): Even with 'Why' links, an Arch cannot stand without foundational 'What' facts!`
    : `⚠️ STUCK IN STM (${bricks} Loose Bricks, ${links} 'Why' Links): Without causal mortar, facts fail to encode into LTM and collapse under twists.`;
  return { svg: frame(inner, `${bricks} fact bricks and ${links} why-links`), banner };
}

// ============================================================================
// UNIT 3 · rereading (feels familiar) vs recalling (actually stored)
// ============================================================================
function renderRetrieval(spec, rereads, recalls) {
  const familiarity = Math.min(98, Math.round(rereads * 18 + recalls * 15));
  const neuralTrail = Math.min(96, Math.round(rereads * 4 + recalls * 28));
  const illusionGap = familiarity - neuralTrail;
  const illusion = illusionGap > 35;

  const box = (x, label, sub, tone) =>
    `<rect x="${x}" y="22" width="80" height="48" rx="10" fill="${tone}" fill-opacity="0.14" stroke="${tone}" stroke-opacity="0.6" stroke-width="1.5"/>
     <text x="${x + 40}" y="42" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">${label}</text>
     <text x="${x + 40}" y="57" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">${sub}</text>`;

  const inner = `
    ${box(12, "📖 The page", "open book", P.amber)}
    ${box(140, "🧠 Working", "memory", P.blue)}
    ${box(268, "🏛️ Long-term", "memory", P.green)}

    <!-- rereading: page → working memory (skips long-term memory) -->
    ${rereads > 0 ? flow("M94,40 L136,40", { color: P.amber, count: rereads, dur: 1.1, r: 3 }) : `<line x1="94" y1="40" x2="136" y2="40" stroke="${P.grid}" stroke-dasharray="3 3"/>`}
    <text x="115" y="84" text-anchor="middle" font-size="9" font-weight="700" style="fill:${P.amber}">reread ${rereads}×</text>

    <!-- recalling: long-term → working memory, book closed -->
    ${
      recalls > 0
        ? flow("M264,52 L224,52", { color: P.green, count: recalls * 2, dur: 1.2, r: 3.2 })
        : `<line x1="224" y1="52" x2="264" y2="52" stroke="${P.red}" stroke-width="2" stroke-dasharray="4 4"/>`
    }
    <text x="244" y="84" text-anchor="middle" font-size="9" font-weight="700" style="fill:${recalls > 0 ? P.green : P.red}">${recalls > 0 ? `recall ${recalls}×` : "never recalled"}</text>

    ${chip(180, 104, illusion ? "🎭 Feels known, isn't stored" : "✓ Really stored", { tone: illusion ? "warn" : "ok", size: 10 })}

    <!-- the two gauges -->
    <text x="14" y="136" font-size="10" font-weight="700" fill="currentColor">👀 Feels familiar right now</text>
    ${stackBar(14, 142, 280, 13, [{ value: familiarity, color: P.amber }], 100)}
    <text x="346" y="154" text-anchor="end" font-size="15" font-weight="800" style="fill:${P.amber}">${familiarity}%</text>
    <text x="14" y="180" font-size="10" font-weight="700" fill="currentColor">🧠 Tomorrow, book closed</text>
    ${stackBar(14, 186, 280, 13, [{ value: neuralTrail, color: P.green }], 100)}
    <text x="346" y="198" text-anchor="end" font-size="15" font-weight="800" style="fill:${P.green}">${neuralTrail}%</text>`;
  const banner =
    illusionGap > 35
      ? `🎭 ILLUSION OF COMPETENCE: ${rereads} Rereads loaded STM from the outside screen (${familiarity}% fluency), leaving the LTM → STM Bridge at ${neuralTrail}%!`
      : `✅ REAL LTM → STM RETRIEVAL TRAIL: ${recalls} Closed-Book Recall attempts built an ${neuralTrail}% durable bridge!`;
  return { svg: frame(inner, `${rereads} rereads and ${recalls} recalls`), banner };
}

// ============================================================================
// UNIT 4 · cramming vs spaced recall over 30 days
// ============================================================================
function renderSpacedCurve(spec, gap, variety) {
  const day30Retention = Math.min(95, Math.round(22 + gap * 8.5 + (variety - 1) * 7));
  const transferScore = Math.min(96, Math.round(18 + gap * 6 + (variety - 1) * 24));
  const isCram = gap === 0;

  // Chart box: x 44..330 = day 1..30, y 40 (100%) .. 150 (0%).
  const X = day => 44 + ((Math.min(30, day) - 1) / 29) * 286;
  const Y = pct => 150 - (pct / 100) * 110;
  const endY = Y(day30Retention);
  const cramEnd = Y(22);
  const recallDays = [0, 1, 2, 3].map(i => 1 + i * gap);
  const pins = recallDays
    .map((d, i) => {
      const x = X(d) + (isCram ? i * 5 : 0);
      return `<circle cx="${x}" cy="150" r="4.5" fill="${P.blue}" stroke="#fff" stroke-width="1.5"/>
        ${!isCram && i > 0 ? `<text x="${(X(recallDays[i - 1]) + x) / 2}" y="143" text-anchor="middle" font-size="10">🌙</text>` : ""}`;
    })
    .join("");

  const inner = `
    ${chip(187, 18, isCram ? "⚡ Cramming: all 4 recalls on day 1" : `🌙 Spaced: a recall every ${gap} day${gap > 1 ? "s" : ""}, with sleep between`, { tone: isCram ? "warn" : "ok", size: 9.5 })}
    <line x1="44" y1="40" x2="44" y2="150" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5"/>
    <line x1="44" y1="150" x2="334" y2="150" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5"/>
    <text x="38" y="44" text-anchor="end" font-size="8.5" fill="currentColor" opacity="0.6">100%</text>
    <text x="38" y="152" text-anchor="end" font-size="8.5" fill="currentColor" opacity="0.6">0%</text>
    <text x="${X(1)}" y="164" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">Day 1</text>
    <text x="${X(14)}" y="164" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">Day 14</text>
    <text x="${X(30)}" y="164" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">Day 30</text>

    <path d="M${X(1)},${Y(100)} Q${X(8)},${Y(30)} ${X(30)},${cramEnd}" fill="none" stroke="${P.red}" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>
    <text x="${X(30) - 4}" y="${cramEnd + 12}" text-anchor="end" font-size="8.5" style="fill:${P.red}">cramming ≈ 22%</text>

    ${drawIn(`M${X(1)},${Y(100)} Q${X(12)},${endY + 10} ${X(30)},${endY}`, `fill="none" stroke="${P.green}" stroke-width="4" stroke-linecap="round"`)}
    <circle cx="${X(30)}" cy="${endY}" r="5.5" fill="${P.green}"><animate attributeName="r" values="5.5;8;5.5" dur="1.6s" repeatCount="indefinite"/></circle>
    ${chip(X(30) - 6, Math.max(52, endY - 16), `Day 30: ${day30Retention}% kept`, { tone: "ok", anchor: "end", size: 9.5 })}
    ${pins}
    ${cap(46, 176, "● RECALLS")}

    <text x="14" y="196" font-size="9.5" font-weight="700" fill="currentColor">🔀 What-if transfer</text>
    ${stackBar(124, 187, 180, 11, [{ value: transferScore, color: P.blue }], 100)}
    <text x="346" y="197" text-anchor="end" font-size="13" font-weight="800" style="fill:${P.blue}">${transferScore}%</text>`;
  const banner = isCram
    ? `⚠️ CRAMMING SHORT-CIRCUIT (Gap = 0d): Answer never left STM between reps — Day-30 LTM retention drops to ${day30Retention}%!`
    : `✅ SPACED CONSOLIDATION (Gap = ${gap}d, Variety = Lv ${variety}): Cleared STM + sleep locks Day-30 LTM at ${day30Retention}% (Transfer: ${transferScore}%)!`;
  return { svg: frame(inner, `Recall gap ${gap} days, variety ${variety}`), banner };
}

// ============================================================================
// UNIT 5 · Sam's whole study system, four stages in a row
// ============================================================================
function renderMasterRecap(spec, traps, deep) {
  const score = Math.max(12, Math.min(96, Math.round(25 - traps * 8 + deep * 15)));
  const fixed = traps <= 1 && deep >= 4;
  const stages = [
    { icon: "🧠", name: "Focus desk", ok: "4 slots clear", bad: "Pings overflow" },
    { icon: "🔗", name: "Why-links", ok: "Arch built", bad: "Rote only" },
    { icon: "📕", name: "Recall", ok: "Book closed", bad: "Rereading" },
    { icon: "🌙", name: "Spacing", ok: "Sleep between", bad: "Cramming" }
  ];
  const tiles = stages
    .map((s, i) => {
      const x = 12 + i * 86;
      const tone = fixed ? P.green : P.red;
      return `<rect x="${x}" y="40" width="74" height="74" rx="12" fill="${tone}" fill-opacity="0.12" stroke="${tone}" stroke-opacity="0.7" stroke-width="2"/>
        <text x="${x + 37}" y="66" text-anchor="middle" font-size="18">${s.icon}</text>
        <text x="${x + 37}" y="84" text-anchor="middle" font-size="9.5" font-weight="700" fill="currentColor">${s.name}</text>
        <text x="${x + 37}" y="100" text-anchor="middle" font-size="8.5" font-weight="600" style="fill:${tone}">${fixed ? `✓ ${s.ok}` : `✖ ${s.bad}`}</text>`;
    })
    .join("");
  const links = [0, 1, 2]
    .map(i => {
      const x1 = 86 + i * 86;
      return fixed
        ? flow(`M${x1},77 L${x1 + 12},77`, { color: P.green, count: 2, dur: 0.8, r: 2.6, trackWidth: 5 })
        : `<text x="${x1 + 6}" y="81" text-anchor="middle" font-size="11" font-weight="800" style="fill:${P.red}">✖</text>`;
    })
    .join("");

  const inner = `
    ${chip(180, 18, "🎒 Sam's study system", { size: 10 })}
    ${tiles}
    ${links}
    <text x="12" y="142" font-size="9.5" font-weight="600" fill="currentColor" opacity="0.75">⚠️ Traps: ${traps}</text>
    <text x="12" y="158" font-size="9.5" font-weight="600" fill="currentColor" opacity="0.75">🧠 Deep habits: ${deep}</text>
    ${stat(348, 150, `${score}%`, "remembered & used on day 30", { color: fixed ? P.green : P.red, size: 24, anchor: "end" })}
    ${stackBar(12, 180, 336, 13, [{ value: score, color: fixed ? P.green : P.red }], 100)}
    ${cap(12, 206, fixed ? "ALL 4 STAGES WORKING" : `BROKEN AT ${traps} STAGE${traps === 1 ? "" : "S"}`)}`;
  const banner = fixed
    ? `🏆 ALL 4 UNITS CONSOLIDATED (Day-30 Transfer = ${score}%): U1 Focus → U2 'Why' Arch Chunk → U3 Closed-Book Recall → U4 Spaced Consolidation!`
    : `⚠️ SAM'S SYSTEM BROKEN (Day-30 Transfer = ${score}%): Set Traps = 0 and Deep Habits = 5 to repair all 4 stages of the STM ↔ LTM pipeline!`;
  return { svg: frame(inner, `Sam's study system: ${traps} traps, ${deep} deep habits`), banner };
}

// ============================================================================
// MYSTERY SCENES (220 × 120 each)
// ============================================================================

/** Mystery 1 · Kitchen: test pairs in a thought-cloud while the stove stays off. */
function sceneKitchen({ last }) {
  const cloud = `<g fill="${P.grid}" fill-opacity="0.12" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4 3">
      <path d="M52,52 C36,52 32,30 50,26 C52,10 80,6 90,18 C100,4 132,6 136,20 C156,12 182,24 172,40 C190,48 176,64 160,60 C150,70 70,70 52,52 Z"/></g>
    <circle cx="96" cy="72" r="4" fill="currentColor" opacity="0.3"/><circle cx="90" cy="80" r="2.5" fill="currentColor" opacity="0.25"/>`;
  const thought =
    last === null
      ? `<text x="110" y="44" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">💭 tap a pair to imagine it</text>`
      : last === 0
      ? `<text x="110" y="42" text-anchor="middle" font-size="16">🥚 + 🍫 = 🤢</text>${chip(110, 58, "only in your head", { tone: "warn", size: 8 })}`
      : `<text x="110" y="42" text-anchor="middle" font-size="16">🥚 + 🍚 = 🍲</text>${chip(110, 58, "✓ ready to cook", { tone: "ok", size: 8 })}`;
  const inner = `
    ${beat(cloud, { period: 3, depth: -0.03 })}
    ${thought}
    <!-- the real stove, still off -->
    <rect x="70" y="98" width="100" height="6" rx="3" fill="${P.slate}"/>
    <path d="M82,88 L158,88 L152,98 L88,98 Z" fill="#475569"/>
    <line x1="158" y1="90" x2="186" y2="84" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
    <circle cx="120" cy="110" r="4" fill="none" stroke="${P.grid}" stroke-width="1.5"/>
    ${chip(42, 108, "stove: off", { size: 8 })}`;
  return sceneFrame(inner, "A thought-cloud above a stove that is still off");
}

/** Mystery 1 · Route map: preview both roads while the car is still parked. */
function sceneCommute({ last, tried }) {
  const high = "M28,60 Q110,6 192,60";
  const side = "M28,60 Q110,112 192,60";
  const road = (d, on, col) =>
    `<path d="${d}" fill="none" stroke="${on ? col : P.grid}" stroke-opacity="${on ? 0.9 : 0.45}" stroke-width="${on ? 5 : 4}" stroke-linecap="round" stroke-dasharray="${on ? "0" : "6 5"}"/>`;
  const ghost = (d, toPoint, col) =>
    `<circle r="7" fill="${col}" stroke="#fff" stroke-width="2"><animateMotion dur="1.2s" fill="freeze" path="${d}" keyPoints="0;${toPoint}" keyTimes="0;1" calcMode="linear"/></circle>`;
  const inner = `
    ${road(high, tried.includes(0), P.amber)}
    ${road(side, tried.includes(1), P.green)}
    <rect x="102" y="26" width="16" height="16" rx="4" fill="${P.red}"/><text x="110" y="38" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">✖</text>
    <text x="110" y="20" text-anchor="middle" font-size="8.5" font-weight="700" style="fill:${P.red}">jam</text>
    <circle cx="28" cy="60" r="8" fill="${P.blue}"/><text x="28" y="80" text-anchor="middle" font-size="8.5" font-weight="700" fill="currentColor">HOME</text>
    <circle cx="192" cy="60" r="8" fill="${P.green}"/><text x="192" y="80" text-anchor="middle" font-size="8.5" font-weight="700" fill="currentColor">WORK</text>
    ${last === 0 ? ghost(high, 0.46, P.red) : last === 1 ? ghost(side, 1, P.green) : ""}
    <text x="28" y="96" text-anchor="middle" font-size="12">🚗</text>
    ${chip(110, 108, last === 0 ? "🔴 +45 min" : last === 1 ? "🟢 18 min" : "car still parked", { tone: last === 0 ? "bad" : last === 1 ? "ok" : "neutral", size: 8.5 })}`;
  return sceneFrame(inner, "Previewing two routes from home to work");
}

/** Mystery 2 · Free throw: three tries, each adjusted from the last miss. */
function sceneCourt({ last, tried }) {
  const shots = [
    { d: "M30,96 Q92,8 150,46 L132,108", col: P.amber, tag: "short" },
    { d: "M30,96 Q112,-18 190,24 L158,108", col: P.red, tag: "long" },
    { d: "M30,96 Q106,-2 170,42 L170,104", col: P.green, tag: "swish!" }
  ];
  const ghosts = tried
    .filter(k => k !== last)
    .map(k => `<path d="${shots[k].d}" fill="none" stroke="${shots[k].col}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.55"/>`)
    .join("");
  const now = last === null ? "" : `<path d="${shots[last].d}" fill="none" stroke="${shots[last].col}" stroke-width="2" stroke-dasharray="4 3" opacity="0.9"/>`;
  const ball =
    last === null
      ? `<circle cx="30" cy="96" r="7" fill="#f97316" stroke="#9a3412" stroke-width="1.5"/>`
      : `<circle r="7" fill="#f97316" stroke="#9a3412" stroke-width="1.5"><animateMotion dur="1.1s" fill="freeze" path="${shots[last].d}"/></circle>`;
  const swish = last === 2;
  const inner = `
    <rect x="194" y="12" width="5" height="50" rx="2" fill="${P.slate}"/>
    <rect x="186" y="14" width="10" height="34" rx="2" fill="none" stroke="${P.slate}" stroke-width="2"/>
    <line x1="156" y1="44" x2="186" y2="44" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
    <path d="M158,44 L163,62 L179,62 L184,44" fill="none" stroke="${swish ? P.green : P.grid}" stroke-width="1.5" stroke-dasharray="2 2"/>
    <line x1="8" y1="112" x2="212" y2="112" stroke="${P.grid}" stroke-width="2"/>
    ${ghosts}${now}${ball}
    ${chip(64, 14, last === null ? "ready at the line" : `try ${last + 1}: ${shots[last].tag}`, { tone: last === null ? "neutral" : swish ? "ok" : "warn", size: 8.5 })}`;
  return sceneFrame(inner, "A free throw, adjusted after each miss");
}

/** Mystery 2 · Espresso: read the gauge, adjust the grind, three pulls. */
function sceneEspresso({ last }) {
  const angle = last === null ? -65 : [60, -40, 0][last];
  const bar = last === null ? "" : ["13 bar · bitter", "4 bar · sour", "9 bar · golden"][last];
  const liquid = last === null ? null : [{ h: 10, c: "#1e1b16" }, { h: 30, c: "#fde68a" }, { h: 24, c: "#b45309" }][last];
  const inner = `
    <!-- pressure gauge -->
    <circle cx="54" cy="58" r="34" fill="${P.grid}" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.4" stroke-width="2"/>
    <path d="M38,28 A34,34 0 0 1 70,28" fill="none" stroke="${P.green}" stroke-width="6" stroke-linecap="round"/>
    <g><line x1="54" y1="58" x2="54" y2="32" stroke="${last === 2 ? P.green : last === null ? P.slate : P.amber}" stroke-width="3" stroke-linecap="round"/>
      <animateTransform attributeName="transform" type="rotate" from="-65 54 58" to="${angle} 54 58" dur="0.7s" fill="freeze"/></g>
    <circle cx="54" cy="58" r="4" fill="currentColor"/>
    <text x="54" y="80" text-anchor="middle" font-size="8.5" font-weight="700" fill="currentColor" opacity="0.6">PRESSURE</text>
    <!-- machine and cup -->
    <rect x="128" y="8" width="64" height="18" rx="4" fill="#475569"/>
    <rect x="152" y="26" width="16" height="10" fill="${P.slate}"/>
    ${liquid ? flow("M160,38 L160,92", { color: liquid.c, count: last === 1 ? 6 : 3, dur: 0.7, r: last === 1 ? 3.6 : 2.2, track: false }) : ""}
    <path d="M140,72 L144,110 L176,110 L180,72 Z" fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-width="2"/>
    <path d="M180,80 C192,80 192,98 178,98" fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-width="2"/>
    ${liquid ? `<rect x="145" y="${109 - liquid.h}" width="30" height="${liquid.h}" rx="2" fill="${liquid.c}"><animate attributeName="height" from="0" to="${liquid.h}" dur="0.8s" fill="freeze"/><animate attributeName="y" from="109" to="${109 - liquid.h}" dur="0.8s" fill="freeze"/></rect>` : ""}
    ${last === 2 ? `<rect x="144" y="${105 - liquid.h}" width="32" height="5" rx="2" fill="${P.amber}"/>` : ""}
    ${chip(54, 108, last === null ? "ready to pull" : bar, { tone: last === null ? "neutral" : last === 2 ? "ok" : "warn", size: 8.5 })}`;
  return sceneFrame(inner, "Espresso pressure gauge and cup");
}

/** Mystery 3 · Oven: out of eggs, swap in something that binds the bubbles. */
function sceneOven({ last }) {
  const h = last === null ? 14 : last === 0 ? 7 : 40;
  const from = last === null ? 14 : 18;
  const fill = last === 1 ? "#f59e0b" : last === 0 ? "#94a3b8" : "#fcd34d";
  const base = 62; // top of the cake tin
  const inner = `
    <rect x="40" y="4" width="140" height="90" rx="10" fill="${P.grid}" fill-opacity="0.08" stroke="${P.slate}" stroke-width="2.5"/>
    <rect x="52" y="12" width="116" height="66" rx="6" fill="#fde68a" fill-opacity="0.12" stroke="${P.slate}" stroke-opacity="0.5"/>
    <line x1="58" y1="86" x2="162" y2="86" stroke="${P.red}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
    <path d="M70,${base} L150,${base} L145,${base + 12} L75,${base + 12} Z" fill="#475569"/>
    <rect x="76" y="${base - h}" width="68" height="${h}" rx="${last === 1 ? 16 : 3}" fill="${fill}">
      <animate attributeName="height" from="${from}" to="${h}" dur="1s" fill="freeze"/>
      <animate attributeName="y" from="${base - from}" to="${base - h}" dur="1s" fill="freeze"/></rect>
    ${last === 1 ? flow(`M92,${base - 2} L92,${base - 36}`, { color: "#fff", count: 3, dur: 1.4, r: 2, track: false }) + flow(`M126,${base - 2} L126,${base - 34}`, { color: "#fff", count: 3, dur: 1.7, r: 2, track: false }) : ""}
    ${last === 0 ? `<text x="110" y="38" text-anchor="middle" font-size="9" font-weight="700" style="fill:${P.red}">bubbles escape</text>` : ""}
    ${chip(110, 106, last === null ? "0 eggs · need a binder" : last === 0 ? "🧂 salt: flat" : "🍌 banana: rises", { tone: last === null ? "neutral" : last === 0 ? "bad" : "ok", size: 8.5 })}`;
  return sceneFrame(inner, "A cake in the oven, made without eggs");
}

/** Mystery 3 · Budget: a surprise $200 bill; drain savings or move money from dining. */
function sceneBudget({ last }) {
  const dining = last === 1 ? 50 : 250;
  const savings = last === 0 ? 100 : 300;
  const inner = `
    ${tank(14, 18, 46, 72, 200 / 300, P.red, { label: "Repair" })}
    <text x="37" y="60" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">−$200</text>
    ${tank(86, 18, 46, 72, dining / 300, P.blue, { label: "Dining" })}
    <text x="109" y="14" text-anchor="middle" font-size="9.5" font-weight="800" fill="currentColor">$${dining}</text>
    ${tank(158, 18, 46, 72, savings / 300, last === 0 ? P.amber : P.green, { label: "Savings" })}
    <text x="181" y="14" text-anchor="middle" font-size="9.5" font-weight="800" style="fill:${last === 0 ? P.amber : last === 1 ? P.green : "currentColor"}">$${savings}</text>
    ${last === 0 ? flow("M181,110 C140,118 80,118 37,110", { color: P.amber, count: 4, dur: 1.3, r: 2.6, trackWidth: 5 }) : ""}
    ${last === 1 ? flow("M109,110 C90,118 60,118 37,110", { color: P.blue, count: 3, dur: 1.1, r: 2.6, trackWidth: 5 }) : ""}
    ${last === null ? chip(110, 111, "surprise: tyre bill", { tone: "warn", size: 8 }) : ""}`;
  return sceneFrame(inner, "Three budget tanks: repair, dining, savings");
}

// ============================================================================
// Registry
// ============================================================================
export const UNIT_RENDERERS = {
  unit1_workbench_ltm: renderWorkbench,
  unit2_arch_chunk: renderArchChunk,
  unit3_fluency_retrieval: renderRetrieval,
  unit4_curve_consolidation: renderSpacedCurve,
  unit5_master_recap: renderMasterRecap
};

export const SCENE_RENDERERS = {
  think_kitchen: sceneKitchen,
  think_commute: sceneCommute,
  think_court: sceneCourt,
  think_espresso: sceneEspresso,
  think_oven: sceneOven,
  think_budget: sceneBudget
};

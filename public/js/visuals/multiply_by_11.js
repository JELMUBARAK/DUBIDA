/**
 * Multiply by 11: the ×10 + ×1 stack (column addition).
 * Drawings for one topic, built with the shared visual kit (../visual-kit.js).
 * UNIT_RENDERERS:  object_spec.type  -> (spec, dial1, dial2) => { svg, banner }
 * SCENE_RENDERERS: scene.toy.visual  -> ({ last, tried }) => svg   (last = option index or null)
 */

import { PALETTE as P, frame, sceneFrame, flow, chip, stat, appear, slideIn } from "../visual-kit.js";

// Digit-tile colours. Solid fills with high-contrast text, so they read the same in light and dark mode.
const TILE = {
  top: { fill: "#2563eb", text: "#ffffff" }, // the ×10 row
  zero: { fill: "#93c5fd", text: "#1e3a8a" }, // the 0 that fills the gap after sliding left
  bottom: { fill: "#f59e0b", text: "#1f2937" }, // the ×1 (or ×k) row
  answer: { fill: "#059669", text: "#ffffff" },
  carry: { fill: "#dc2626", text: "#ffffff" },
  blank: { fill: "none", text: "currentColor" }
};

/** One digit tile centred on (cx, cy). */
function tile(cx, cy, ch, kind, { w = 26, h = 30, size = 18 } = {}) {
  const t = TILE[kind];
  const blank = kind === "blank";
  return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="6" fill="${t.fill}" ${
    blank ? `stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="3 3"` : `filter="url(#vk-shadow)"`
  }/>
    <text x="${cx}" y="${cy + size * 0.36}" text-anchor="middle" font-size="${size}" font-weight="800" fill="${t.text}" ${blank ? `opacity="0.45"` : ""}>${ch}</text>`;
}

/** Right-aligned row of digit tiles: column 0 is the ones column at x = rightX. */
function tileRow(str, rightX, cy, kind, colW, opts = {}) {
  return [...str]
    .reverse()
    .map((ch, i) => tile(rightX - i * colW, cy, ch, kind === "top" && i === 0 && opts.zeroLast ? "zero" : kind, opts))
    .join("");
}


/** A labelled token travelling along a path, looping. Kit candidate: carrier (flow() with a label). */
function carrier(d, label, { color = TILE.carry.fill, dur = 2.2, r = 8 } = {}) {
  return `<g><animateMotion dur="${dur}s" repeatCount="indefinite" path="${d}" keyTimes="0;0.7;1" keyPoints="0;1;1" calcMode="linear"/>
      <circle r="${r}" fill="${color}" filter="url(#vk-shadow)"/>
      <text y="${r * 0.42}" text-anchor="middle" font-size="${r * 1.25}" font-weight="800" fill="#fff">${label}</text>
    </g>`;
}

const smallText = (x, y, text, { anchor = "start", opacity = 0.7, size = 9.5, weight = 600, color = "currentColor" } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}" opacity="${opacity}">${text}</text>`;

// ============================================================================
// UNITS — the stack: (n × 10) + (n × k), added column by column
// ============================================================================
function renderTimesEleven(spec, d1, d2) {
  const layer = spec.layer;

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

  const tStr = String(top);
  const bStr = String(bottom);
  const aStr = String(answer);
  const cols = Math.max(tStr.length, bStr.length, aStr.length);

  // Column-by-column carries for the addition top + bottom (carries[i] = carry OUT of column i).
  const carries = [];
  let carry = 0;
  for (let i = 0; i < cols; i++) {
    const s = Number(tStr[tStr.length - 1 - i] || 0) + Number(bStr[bStr.length - 1 - i] || 0) + carry;
    carry = s >= 10 ? 1 : 0;
    carries.push(carry);
  }

  // Stack geometry (left panel).
  const colW = 30;
  const rightX = 176;
  const yTop = 44;
  const yBot = 84;
  const yLine = 106;
  const yAns = 132;
  const colX = i => rightX - i * colW;

  // Faint column guides + one dot per column travelling down: "add each column".
  let guides = "";
  for (let i = 0; i < Math.max(tStr.length, bStr.length); i++) {
    const x = colX(i);
    guides += `<rect x="${x - 16}" y="${yTop - 20}" width="32" height="${yAns - yTop + 38}" rx="9" fill="${P.grid}" fill-opacity="0.1"/>`;
    guides += flow(`M${x},${yTop + 16} L${x},${yAns - 17}`, { color: P.green, count: 1, dur: 1.8, r: 1.8, track: false });
  }

  // Carries: a red "1" travels from the column that overflowed up to the top of the next column.
  let carryMarks = "";
  carries.forEach((c, i) => {
    if (!c) return;
    const from = colX(i);
    const to = colX(i + 1);
    carryMarks += carrier(`M${from},${yAns - 6} C${from},${yTop - 34} ${to},${yTop - 40} ${to},${yTop - 30}`, "1", { dur: 2.4 });
    carryMarks += `<text x="${to + 12}" y="${yTop - 22}" font-size="11" font-weight="800" fill="${TILE.carry.fill}">¹</text>`;
  });

  const plusX = colX(cols - 1) - 28;
  let inner = `
    ${smallText(6, yTop + 4, `${n} × 10`)}
    ${smallText(6, yBot + 4, `${n} × ${k}`)}
    ${smallText(6, yAns + 4, "answer")}
    ${guides}
    ${slideIn(tileRow(tStr, rightX, yTop, "top", colW, { zeroLast: true }), colW)}
    <text x="${plusX}" y="${yBot + 8}" text-anchor="middle" font-size="22" font-weight="700" fill="currentColor" opacity="0.7">+</text>
    ${tileRow(bStr, rightX, yBot, "bottom", colW)}
    <line x1="${plusX - 12}" y1="${yLine}" x2="${rightX + 18}" y2="${yLine}" stroke="currentColor" stroke-opacity="0.55" stroke-width="2.5" stroke-linecap="round"/>
    ${appear(tileRow(aStr, rightX, yAns, "answer", colW, { size: 19 }), { begin: 0.75 })}
    ${carryMarks}
    ${appear(chip(110, 170, "×10 = every digit slides one place left", { tone: "info", size: 8.5 }), { begin: 0.2 })}`;

  let banner;
  if (layer === "split") {
    inner += `
      ${chip(282, 26, `${n} × ${10 + k}`, { size: 12 })}
      ${smallText(220, 62, `= ${n} × 10 + ${n} × ${k}`, { size: 11.5, opacity: 0.9 })}
      ${smallText(220, 86, `= ${top} + ${bottom}`, { size: 11.5, opacity: 0.9 })}
      ${stat(220, 126, `= ${answer}`, "add the two rows", { color: P.green, size: 24 })}
      ${chip(110, 195, k > 1 ? `Bottom row is ${n} × ${k}, not just ${n}` : "×11: bottom row is the number itself", { tone: k > 1 ? "warn" : "neutral", size: 9 })}`;
    banner = `🧮 SPLIT: ${n} × ${10 + k} = ${n} × 10 + ${n} × ${k} = ${top} + ${bottom} = ${answer}.`;
  } else {
    const a = d1;
    const b = d2;
    const s = a + b;
    const carried = s >= 10;
    // Shortcut: a | a+b | b, with the carry hopping onto the front digit when the middle reaches 10.
    const front = carried ? a + 1 : a;
    const wide = front >= 10;
    const sx = [wide ? 242 : 246, 284, 322];
    const sy = 66;
    inner += `
      ${chip(284, 14, "Shortcut", { size: 10.5 })}
      ${tile(sx[0], sy, front, carried ? "carry" : "answer", { w: wide ? 42 : 32, h: 36, size: 19 })}
      ${tile(sx[1], sy, carried ? s - 10 : s, "bottom", { w: 32, h: 36, size: 19 })}
      ${tile(sx[2], sy, b, "answer", { w: 32, h: 36, size: 19 })}
      ${carried ? carrier(`M${sx[1]},${sy - 24} C${sx[1]},${sy - 36} ${sx[0]},${sy - 36} ${sx[0]},${sy - 24}`, "1", { dur: 2 }) : ""}
      ${smallText(284, 104, `middle = ${a} + ${b} = ${s}`, { anchor: "middle", size: 10.5, opacity: 0.85 })}
      ${
        carried
          ? `${chip(284, 126, `${s} ≥ 10: write ${s - 10}, carry 1`, { tone: "bad", size: 9.5 })}
             ${smallText(284, 150, `front ${a} + 1 = ${a + 1}`, { anchor: "middle", size: 10, color: TILE.carry.fill, opacity: 1, weight: 700 })}`
          : chip(284, 126, "no carry needed", { tone: "ok", size: 9.5 })
      }
      ${stat(284, 184, `= ${answer}`, `${n} × 11`, { color: P.green, size: 22, anchor: "middle" })}`;
    banner = carried
      ? `🔁 CARRY: ${n} × 11 → middle ${a} + ${b} = ${s} → write ${s - 10}, carry 1 onto ${a} → ${answer}.`
      : `✅ ${n} × 11 = ${top} + ${n}: ends ${a} … ${b}, middle ${a} + ${b} = ${s} → ${answer}.`;
  }

  return { svg: frame(inner, `${n} times ${layer === "split" ? 10 + k : 11}`), banner };
}

// ============================================================================
// SCENES — one picture per mystery scene (220 × 120)
// ============================================================================
const tried = (s, k) => s.tried.includes(k);

/** Mystery 1 · Paying $11: a $10 note and a $1 coin move from the wallet to the counter. */
function sceneWallet(s) {
  const note = tried(s, 0);
  const coin = tried(s, 1);
  const paid = (note ? 10 : 0) + (coin ? 1 : 0);
  const noteSvg = `<rect x="0" y="0" width="48" height="24" rx="4" fill="#059669" filter="url(#vk-shadow)"/><rect x="3" y="3" width="42" height="18" rx="3" fill="none" stroke="#a7f3d0" stroke-width="1"/><text x="24" y="16.5" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">$10</text>`;
  const coinSvg = `<circle cx="0" cy="0" r="11" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" filter="url(#vk-shadow)"/><text x="0" y="4" text-anchor="middle" font-size="9.5" font-weight="800" fill="#1f2937">$1</text>`;
  const place = (svg, x, y, fromX, fromY, moved) =>
    moved
      ? `<g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="translate" from="${fromX - x} ${fromY - y}" to="0 0" dur="0.6s" fill="freeze"/>${svg}</g></g>`
      : `<g transform="translate(${x} ${y})">${svg}</g>`;
  return sceneFrame(
    `
    <!-- wallet -->
    <rect x="6" y="40" width="66" height="56" rx="9" fill="#92400e" fill-opacity="0.85"/>
    <rect x="6" y="40" width="66" height="16" rx="8" fill="#78350f"/>
    ${smallText(39, 108, "wallet", { anchor: "middle" })}
    ${note ? "" : place(noteSvg, 14, 66, 14, 66, false)}
    ${coin ? "" : place(coinSvg, 58, 52, 58, 52, false)}
    <!-- counter -->
    <rect x="88" y="40" width="124" height="56" rx="9" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4 3"/>
    ${smallText(150, 108, "paid on the counter", { anchor: "middle" })}
    ${note ? place(noteSvg, 98, 56, 14, 66, s.last === 0) : ""}
    ${coin ? place(coinSvg, 176, 68, 58, 52, s.last === 1) : ""}
    ${chip(150, 18, paid === 11 ? "$11 paid ✓" : `Price $11 · paid $${paid}`, { tone: paid === 11 ? "ok" : paid ? "warn" : "neutral", size: 9.5 })}`,
    "Paying $11 with a $10 note and a $1 coin"
  );
}

/** Mystery 1 · Football team: 10 outfield players + 1 goalkeeper = 11. */
function sceneTeam(s) {
  const field = tried(s, 0);
  const keeper = tried(s, 1);
  const count = (field ? 10 : 0) + (keeper ? 1 : 0);
  const spots = [
    [62, 26], [62, 50], [62, 74], [62, 98],
    [112, 26], [112, 50], [112, 74], [112, 98],
    [162, 44], [162, 80]
  ];
  const player = (x, y, fill, grow) =>
    `<circle cx="${x}" cy="${y}" r="6.5" fill="${fill}" stroke="#fff" stroke-width="1.8">${grow ? `<animate attributeName="r" from="0" to="6.5" dur="0.45s" fill="freeze"/>` : ""}</circle>`;
  return sceneFrame(
    `
    <rect x="8" y="10" width="204" height="102" rx="8" fill="#16a34a" fill-opacity="0.85"/>
    <g stroke="#ffffff" stroke-opacity="0.7" stroke-width="1.5" fill="none">
      <rect x="12" y="14" width="196" height="94" rx="5"/>
      <line x1="110" y1="14" x2="110" y2="108"/>
      <circle cx="110" cy="61" r="14"/>
      <rect x="12" y="40" width="22" height="42"/>
    </g>
    <rect x="6" y="48" width="6" height="26" fill="#ffffff" fill-opacity="0.9"/>
    ${field ? spots.map(([x, y]) => player(x, y, P.blue, s.last === 0)).join("") : ""}
    ${keeper ? player(24, 61, P.amber, s.last === 1) : `<circle cx="24" cy="61" r="6.5" fill="none" stroke="#fff" stroke-dasharray="2 2" stroke-opacity="0.8"/>`}
    ${chip(176, 20, count === 11 ? "10 + 1 = 11 ✓" : `${count} / 11 players`, { tone: count === 11 ? "ok" : "neutral", size: 9 })}`,
    "A football team: 10 outfield players and 1 goalkeeper"
  );
}

/** Mystery 2 · Calculator: ×10 slides every digit one place left, and a 0 fills the gap. */
function sceneCalculator(s) {
  const value = s.last === null ? "23" : s.last === 0 ? "230" : "2300";
  const colW = 28;
  const rightX = 172;
  const labels = ["ones", "tens", "hund.", "thous."];
  const digits = [...value]
    .reverse()
    .map((ch, i) => {
      const fresh = s.last !== null && i === 0; // the new 0 that fills the gap
      return `<text x="${rightX - i * colW}" y="46" text-anchor="middle" font-size="22" font-weight="800" fill="${fresh ? "#fbbf24" : "#a7f3d0"}">${ch}</text>`;
    })
    .join("");
  return sceneFrame(
    `
    <rect x="16" y="4" width="188" height="112" rx="12" fill="#334155"/>
    <rect x="26" y="14" width="168" height="44" rx="6" fill="#0f172a"/>
    ${labels.map((l, i) => `<text x="${rightX - i * colW}" y="70" text-anchor="middle" font-size="7.5" font-weight="600" fill="#cbd5e1">${l}</text>`).join("")}
    ${s.last === null ? digits : slideIn(digits, colW, { dur: 0.6 })}
    <g font-size="11" font-weight="800" text-anchor="middle">
      <rect x="34" y="80" width="40" height="26" rx="6" fill="#475569"/><text x="54" y="97" fill="#e2e8f0">C</text>
      <rect x="80" y="80" width="40" height="26" rx="6" fill="#475569"/><text x="100" y="97" fill="#e2e8f0">=</text>
      <rect x="126" y="80" width="60" height="26" rx="6" fill="${s.last === null ? "#475569" : "#f59e0b"}" ${s.last === null ? "" : `filter="url(#vk-shadow)"`}/><text x="156" y="97" fill="${s.last === null ? "#e2e8f0" : "#1f2937"}">× 10</text>
    </g>`,
    `A calculator showing ${value}`
  );
}

/** Mystery 2 · Coins to notes: seven $1 coins sit in the ones place; seven $10 notes sit in the tens place. */
function sceneCoins(s) {
  const mode = s.last; // null | 0 coins | 1 notes
  const grid = i => [14 + (i % 4) * 16, 34 + Math.floor(i / 4) * 22];
  const coins = mode === 0
    ? Array.from({ length: 7 }, (_, i) => {
        const [x, y] = grid(i);
        return `<g transform="translate(${118 + x} ${y})"><circle r="7" fill="#f59e0b" stroke="#b45309" stroke-width="1.2"><animate attributeName="r" from="0" to="7" dur="0.35s" begin="${i * 0.06}s" fill="freeze"/></circle></g>`;
      }).join("")
    : "";
  const notes = mode === 1
    ? Array.from({ length: 7 }, (_, i) => {
        const x = 20 + (i % 2) * 34;
        const y = 26 + Math.floor(i / 2) * 15;
        return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${i * 0.06}s" dur="0.3s" fill="freeze"/><rect x="${x}" y="${y}" width="30" height="12" rx="2" fill="#059669"/><text x="${x + 15}" y="${y + 9}" text-anchor="middle" font-size="7" font-weight="800" fill="#fff">$10</text></g>`;
      }).join("")
    : "";
  const tensDigit = mode === 1 ? "7" : "0";
  const onesDigit = mode === 0 ? "7" : "0";
  const total = mode === 0 ? "$7" : mode === 1 ? "$70" : "$0";
  return sceneFrame(
    `
    <rect x="12" y="6" width="94" height="88" rx="8" fill="${mode === 1 ? "#ecfdf5" : "none"}" fill-opacity="${mode === 1 ? 0.25 : 0}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5"/>
    <rect x="114" y="6" width="94" height="88" rx="8" fill="${mode === 0 ? "#fffbeb" : "none"}" fill-opacity="${mode === 0 ? 0.25 : 0}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5"/>
    ${smallText(59, 18, "TENS", { anchor: "middle", size: 8.5, weight: 700 })}
    ${smallText(161, 18, "ONES", { anchor: "middle", size: 8.5, weight: 700 })}
    ${notes}${coins}
    <text x="59" y="112" text-anchor="middle" font-size="18" font-weight="800" fill="${mode === 1 ? "#059669" : "currentColor"}" opacity="${mode === 1 ? 1 : 0.35}">${tensDigit}</text>
    <text x="161" y="112" text-anchor="middle" font-size="18" font-weight="800" fill="${mode === 0 ? "#d97706" : "currentColor"}" opacity="${mode === 0 ? 1 : 0.35}">${onesDigit}</text>
    ${chip(110, 102, total, { tone: mode === null ? "neutral" : "ok", size: 11 })}`,
    `Place value: ${total}`
  );
}

/** Mystery 3 · n on n×10: the outside columns stay, the middle column adds the two digits. */
function stackScene(n) {
  const [a, b] = String(n).split("").map(Number);
  return s => {
    const ends = tried(s, 0);
    const mid = tried(s, 1);
    const xs = [70, 100, 130]; // hundreds, tens, ones
    const focus = s.last === null ? -1 : s.last === 0 ? "ends" : "mid";
    const glow = i =>
      (focus === "ends" && i !== 1) || (focus === "mid" && i === 1)
        ? `<rect x="${xs[i] - 14}" y="8" width="28" height="104" rx="8" fill="${focus === "mid" ? "#f59e0b" : "#10b981"}" fill-opacity="0.18"/>`
        : "";
    const small = { w: 24, h: 26, size: 15 };
    const ans = [ends ? a : "?", mid ? a + b : "?", ends ? b : "?"];
    return sceneFrame(
      `
      ${[0, 1, 2].map(glow).join("")}
      ${tile(xs[0], 22, a, "top", small)}${tile(xs[1], 22, b, "top", small)}${tile(xs[2], 22, 0, "zero", small)}
      <text x="44" y="58" text-anchor="middle" font-size="16" font-weight="700" fill="currentColor" opacity="0.6">+</text>
      ${tile(xs[1], 52, a, "bottom", small)}${tile(xs[2], 52, b, "bottom", small)}
      <line x1="36" y1="72" x2="146" y2="72" stroke="currentColor" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
      ${ans.map((ch, i) => tile(xs[i], 92, ch, ch === "?" ? "blank" : "answer", small)).join("")}
      ${focus === "mid" ? flow(`M${xs[1]},34 L${xs[1]},80`, { color: P.amber, count: 2, dur: 1.2, r: 2.6, track: false }) : ""}
      ${smallText(158, 26, `${n} × 10`, { size: 9 })}
      ${smallText(158, 56, `${n}`, { size: 9 })}
      ${
        mid && ends
          ? chip(186, 92, `= ${n * 11}!`, { tone: "ok", size: 11 })
          : mid
          ? chip(186, 92, `${b} + ${a} = ${a + b}`, { tone: "warn", size: 9.5 })
          : ends
          ? chip(186, 92, `${a} … ${b}`, { tone: "ok", size: 10 })
          : smallText(158, 96, "tap a column", { size: 9 })
      }`,
      `${n} stacked on ${n * 10}`
    );
  };
}

export const UNIT_RENDERERS = {
  times_eleven: renderTimesEleven
};

export const SCENE_RENDERERS = {
  m11_wallet: sceneWallet,
  m11_team: sceneTeam,
  m11_calculator: sceneCalculator,
  m11_coins: sceneCoins,
  m11_stack23: stackScene(23),
  m11_stack45: stackScene(45)
};

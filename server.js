/**
 * Understanding App — Universal Core Engine HTTP Server & Telemetry API
 * Serves:
 *   GET  /             -> Apple-Minimalist Learner Discovery Surface (public/index.html)
 *   GET  /dev          -> Developer Route, 5-Gate Compiler & Telemetry Inspector (public/dev.html)
 *   GET  /api/health   -> Engine health & version check
 *   GET  /api/topic    -> Verified Flagship Topic Pack JSON
 *   GET  /api/validate -> 5-Gate Lesson Compiler & Guardrail Audit Report
 *   POST /api/grade    -> Split-Rubric Grader endpoint
 *   GET  /api/ledger   -> Versioned Evidence Ledger + Gate 5 Runtime Canary report
 *   POST /api/ledger   -> Append immutable attempt entry to the Versioned Evidence Ledger
 *   GET  /api/canary   -> Gate 5 Runtime Misconception Canary status (>15% threshold)
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { THINKING_LEARNING_UNDERSTANDING_PACK } from "./src/topics/thinking_learning_understanding.js";
import { compileAndValidateTopicPack } from "./src/engine/schema.js";
import { evaluateSplitRubric } from "./src/engine/grader.js";
import { EvidenceLedgerStore } from "./src/engine/ledger.js";
import { getPack, listPacks } from "./src/topics/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const ledgerStore = new EvidenceLedgerStore();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }
    // no-cache: the browser always checks for the latest file, so updates show without a hard refresh.
    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-cache" });
    res.end(content);
  });
}

export async function handleAppRequest(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers?.host || "localhost"}`);
  const pathname = url.pathname;

  // REST API Routes
  if (pathname === "/api/health" && req.method === "GET") {
    const report = compileAndValidateTopicPack(THINKING_LEARNING_UNDERSTANDING_PACK);
    sendJson(res, 200, {
      status: "ok",
      version: THINKING_LEARNING_UNDERSTANDING_PACK.version,
      topic_pack_id: THINKING_LEARNING_UNDERSTANDING_PACK.topic_pack_id,
      compiler_gates_valid: report.valid
    });
    return;
  }

  if (pathname === "/api/topic" && req.method === "GET") {
    sendJson(res, 200, THINKING_LEARNING_UNDERSTANDING_PACK);
    return;
  }

  // Lesson registry for the search page and the generic lesson player.
  if (pathname === "/api/packs" && req.method === "GET") {
    sendJson(res, 200, { packs: listPacks() });
    return;
  }

  const packMatch = pathname.match(/^\/api\/packs\/([\w-]+)$/);
  if (packMatch && req.method === "GET") {
    const pack = getPack(packMatch[1]);
    if (!pack) {
      sendJson(res, 404, { error: `Unknown topic: ${packMatch[1]}` });
      return;
    }
    const report = compileAndValidateTopicPack(pack);
    if (!report.valid) {
      sendJson(res, 422, { error: "Topic failed the 5-gate compiler", errors: report.errors });
      return;
    }
    sendJson(res, 200, pack);
    return;
  }

  if (pathname === "/api/validate" && req.method === "GET") {
    const report = compileAndValidateTopicPack(THINKING_LEARNING_UNDERSTANDING_PACK);
    sendJson(res, report.valid ? 200 : 422, report);
    return;
  }

  if (pathname === "/api/grade" && req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const unit =
        THINKING_LEARNING_UNDERSTANDING_PACK.units.find(u => u.topic_id === body.topic_id) ||
        THINKING_LEARNING_UNDERSTANDING_PACK.units[0];
      const result = evaluateSplitRubric({
        unit,
        howChoiceId: body.howChoiceId,
        whyText: body.whyText,
        followupAlreadyAsked: Boolean(body.followupAlreadyAsked),
        priorHelpUsed: Array.isArray(body.priorHelpUsed) ? body.priorHelpUsed : []
      });
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  if (pathname === "/api/ledger" && req.method === "GET") {
    sendJson(res, 200, {
      entries: ledgerStore.list(100),
      canary: ledgerStore.getCanaryReport(0.15)
    });
    return;
  }

  if (pathname === "/api/ledger" && req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const entry = ledgerStore.append(body);
      sendJson(res, 201, {
        entry,
        entries: ledgerStore.list(100),
        canary: ledgerStore.getCanaryReport(0.15)
      });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  if (pathname === "/api/canary" && req.method === "GET") {
    sendJson(res, 200, ledgerStore.getCanaryReport(0.15));
    return;
  }

  // HTML Surface Routes
  // Start page: minimal search box (type a topic, upload files, YouTube links, web toggle).
  if (pathname === "/" || pathname === "/search.html") {
    serveStaticFile(res, path.join(__dirname, "public", "search.html"));
    return;
  }

  // The flagship lesson, now played by the shared lesson player (Unified Lesson Flow).
  // The player sees no ?topic= and picks the pack whose registry href is "/learn".
  // public/index.html + js/learner-app.js (the old hand-built page) are kept on disk, unused, as a fallback.
  if (pathname === "/learn" || pathname === "/index.html") {
    serveStaticFile(res, path.join(__dirname, "public", "lesson.html"));
    return;
  }

  // Generic lesson player for every non-flagship topic: /lesson?topic=<id>
  if (pathname === "/lesson" || pathname === "/lesson.html") {
    serveStaticFile(res, path.join(__dirname, "public", "lesson.html"));
    return;
  }

  if (pathname === "/dev" || pathname === "/dev.html") {
    serveStaticFile(res, path.join(__dirname, "public", "dev.html"));
    return;
  }

  // Shared ES Module Routes (/src/*)
  if (pathname.startsWith("/src/")) {
    const safeRel = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
    const targetPath = path.join(__dirname, safeRel);
    if (targetPath.startsWith(path.join(__dirname, "src"))) {
      serveStaticFile(res, targetPath);
      return;
    }
  }

  // Static Assets (/css/*, /js/*)
  const safePublicRel = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  const publicPath = path.join(__dirname, "public", safePublicRel);
  if (
    publicPath.startsWith(path.join(__dirname, "public")) &&
    fs.existsSync(publicPath) &&
    fs.statSync(publicPath).isFile()
  ) {
    serveStaticFile(res, publicPath);
    return;
  }

  sendJson(res, 404, { error: `Route not found: ${pathname}` });
}

export function createAppServer() {
  return http.createServer(handleAppRequest);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const report = compileAndValidateTopicPack(THINKING_LEARNING_UNDERSTANDING_PACK);
  if (!report.valid) {
    console.error("❌ 5-Gate Lesson Compiler Guardrail Failure:", report.errors);
    process.exit(1);
  }
  const server = createAppServer();
  server.listen(PORT, () => {
    console.log(`✅ Understanding App v${THINKING_LEARNING_UNDERSTANDING_PACK.version} running:`);
    console.log(`   • Learner Discovery Surface (/):     http://localhost:${PORT}/`);
    console.log(`   • Developer & Engine Route (/dev):   http://localhost:${PORT}/dev`);
    console.log(`   • 5-Gate Compiler Audit (/api/...):  All ${report.unit_count} units & ${report.discovery_card_count} discovery cards verified.`);
  });
}

/**
 * Topic registry: every lesson the app can play.
 * - The flagship pack keeps its own hand-built page at /learn.
 * - All other packs are played by the generic player at /lesson?topic=<topic_pack_id>.
 */

import { THINKING_LEARNING_UNDERSTANDING_PACK } from "./thinking_learning_understanding.js";
import { AREA_VS_PERIMETER_PACK } from "./area_vs_perimeter.js";
import { HEART_PUMP_PACK } from "./heart_pump.js";
import { MULTIPLY_BY_11_PACK } from "./multiply_by_11.js";

export const FLAGSHIP_PACK_ID = THINKING_LEARNING_UNDERSTANDING_PACK.topic_pack_id;

export const ALL_PACKS = [THINKING_LEARNING_UNDERSTANDING_PACK, HEART_PUMP_PACK, MULTIPLY_BY_11_PACK, AREA_VS_PERIMETER_PACK];

export function getPack(id) {
  return ALL_PACKS.find(p => p.topic_pack_id === id) || null;
}

/** Short listing for the search page. */
export function listPacks() {
  return ALL_PACKS.map(p => ({
    id: p.topic_pack_id,
    title: p.title,
    kind: p.kind || "concept",
    subtitle: p.subtitle || `${(p.discovery_cards || []).length} mysteries · ${(p.units || []).length} units`,
    keywords: p.search_keywords || p.title.toLowerCase().split(/[^a-z]+/).filter(Boolean),
    href: p.topic_pack_id === FLAGSHIP_PACK_ID ? "/learn" : `/lesson?topic=${encodeURIComponent(p.topic_pack_id)}`
  }));
}

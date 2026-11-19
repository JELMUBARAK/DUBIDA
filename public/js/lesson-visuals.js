/**
 * Living-object and scene-picture registry for the lesson player (/lesson) and the dev console.
 *
 * Every drawing is built with the shared visual kit (./visual-kit.js): that is the standard for all
 * visual experiences. Drawings live in one module per topic under ./visuals/, each exporting:
 *   UNIT_RENDERERS:  object_spec.type -> (spec, dial1, dial2) => { svg, banner }
 *   SCENE_RENDERERS: scene.toy.visual -> ({ last, tried }) => svg
 * `objectSpec.layer` selects what a unit focuses on, so all units of a topic share one evolving
 * drawing (Gate 1: no metaphor hopping). Pure functions (no DOM), so Node tests can import this file.
 */

import * as heart from "./visuals/heart.js";
import * as times11 from "./visuals/multiply_by_11.js";
import * as area from "./visuals/area_vs_perimeter.js";
import * as thinking from "./visuals/thinking.js";

const MODULES = [heart, times11, area, thinking];
const UNIT_RENDERERS = Object.assign({}, ...MODULES.map(m => m.UNIT_RENDERERS));
const SCENE_RENDERERS = Object.assign({}, ...MODULES.map(m => m.SCENE_RENDERERS));

export function hasVisual(spec) {
  return Boolean(spec && UNIT_RENDERERS[spec.type]);
}

export function renderVisual(spec, d1, d2) {
  const fn = UNIT_RENDERERS[spec?.type];
  if (!fn) {
    return { svg: "", banner: "" };
  }
  return fn(spec, d1, d2);
}

/** True when a mystery scene has a picture (scene.toy.visual names a scene renderer). */
export function hasScene(scene) {
  return Boolean(scene?.toy?.visual && SCENE_RENDERERS[scene.toy.visual]);
}

/** Picture for a mystery scene. last = index of the option just tapped (null before any tap); tried = indices tapped so far. */
export function renderScene(scene, last = null, tried = []) {
  const fn = SCENE_RENDERERS[scene?.toy?.visual];
  return fn ? fn({ last, tried }) : "";
}

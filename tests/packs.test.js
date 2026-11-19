import test from "node:test";
import assert from "node:assert/strict";

import { ALL_PACKS, FLAGSHIP_PACK_ID, getPack, listPacks } from "../src/topics/index.js";
import { compileAndValidateTopicPack } from "../src/engine/schema.js";
import { evaluateSplitRubric } from "../src/engine/grader.js";
import { UnitRuntimeSession } from "../src/engine/runtime.js";
import { renderVisual, hasVisual, renderScene, hasScene } from "../public/js/lesson-visuals.js";

const NEW_PACKS = ALL_PACKS.filter(p => p.topic_pack_id !== FLAGSHIP_PACK_ID);
const oneCorrect = (opts, label) => assert.equal(opts.filter(o => o.correct).length, 1, `${label}: exactly one correct option`);

test("Registry lists every pack with a link; flagship keeps /learn", () => {
  const list = listPacks();
  assert.equal(list.length, ALL_PACKS.length);
  assert.equal(list.find(p => p.id === FLAGSHIP_PACK_ID).href, "/learn");
  for (const p of NEW_PACKS) {
    assert.equal(getPack(p.topic_pack_id), p);
    assert.ok(list.find(x => x.id === p.topic_pack_id).href.startsWith("/lesson?topic="));
  }
});

// The visual kit (public/js/visual-kit.js) is the standard for every drawing: units use frame(), scenes use sceneFrame().
const KIT_UNIT = /^<svg [^>]*class="[^"]*\bvk\b/;
const KIT_SCENE = /^<svg [^>]*class="[^"]*\bvk-scene\b/;
const BROKEN = /NaN|undefined|Infinity/;

for (const pack of ALL_PACKS) {
  test(`Kit standard · ${pack.title}: every unit drawing is built with the visual kit`, () => {
    for (const unit of pack.units) {
      const { dial1, dial2 } = unit.object_spec.dials;
      for (const [a, b] of [[dial1.min, dial2.min], [dial1.max, dial2.max], [dial1.min, dial2.max], [dial1.max, dial2.min]]) {
        const { svg } = renderVisual(unit.object_spec, a, b);
        assert.match(svg, KIT_UNIT, `${unit.topic_id} @ ${a},${b} must use frame() from the visual kit`);
      }
    }
  });

  test(`Kit standard · ${pack.title}: every mystery scene has a kit picture for every tap`, () => {
    for (const card of pack.discovery_cards) {
      for (const scene of card.scenes) {
        const where = `${card.id}/${scene.id}`;
        assert.ok(hasScene(scene), `${where}: toy.visual '${scene.toy?.visual}' needs a scene renderer`);
        const states = [[null, []], ...scene.toy.options.map((_, k) => [k, scene.toy.options.map((__, j) => j).slice(0, k + 1)])];
        for (const [last, tried] of states) {
          const svg = renderScene(scene, last, tried);
          assert.match(svg, KIT_SCENE, `${where} (tap ${last}) must use sceneFrame() from the visual kit`);
          assert.ok(!BROKEN.test(svg), `${where} (tap ${last}) has NaN/undefined`);
        }
      }
    }
  });
}

test("Flagship: every unit's living object renders in the generic player at every dial setting", () => {
  for (const unit of getPack(FLAGSHIP_PACK_ID).units) {
    assert.ok(hasVisual(unit.object_spec), `${unit.topic_id}: renderer for type '${unit.object_spec.type}'`);
    const { dial1, dial2 } = unit.object_spec.dials;
    for (let a = dial1.min; a <= dial1.max; a++) {
      for (let b = dial2.min; b <= dial2.max; b++) {
        const { svg, banner } = renderVisual(unit.object_spec, a, b);
        assert.ok(svg.startsWith("<svg") && banner.length > 0, `${unit.topic_id} @ ${a},${b}`);
        assert.ok(!/NaN|undefined|Infinity/.test(svg + banner), `${unit.topic_id} @ ${a},${b} has no NaN/undefined`);
      }
    }
  }
});

for (const pack of NEW_PACKS) {
  test(`${pack.title}: passes the 5-gate compiler with 3 mysteries and 3 units`, () => {
    const report = compileAndValidateTopicPack(pack);
    assert.equal(report.valid, true, report.errors.join("\n"));
    assert.equal(report.discovery_card_count, 3);
    assert.equal(report.unit_count, 3);
  });

  test(`${pack.title}: every question has exactly one right answer; toys and player data are complete`, () => {
    for (const card of pack.discovery_cards) {
      oneCorrect(card.options, card.id);
      for (const sc of card.scenes) {
        assert.ok(sc.toy?.options?.length >= 2, `${card.id}/${sc.id} toy needs 2+ options`);
      }
    }
    for (const u of pack.units) {
      oneCorrect(u.what_gate.options, `${u.topic_id} what_gate`);
      oneCorrect(u.how_why_challenge.part1_choices, `${u.topic_id} part1`);
      oneCorrect(u.what_if_proof.options, `${u.topic_id} what_if`);
      const { dial1, dial2 } = u.object_spec.dials;
      for (const exp of [u.object_spec.target_experiment, u.object_spec.whatif_experiment]) {
        assert.ok(exp.dial1 >= dial1.min && exp.dial1 <= dial1.max, `${u.topic_id} experiment dial1 in range`);
        assert.ok(exp.dial2 >= dial2.min && exp.dial2 <= dial2.max, `${u.topic_id} experiment dial2 in range`);
      }
    }
    oneCorrect(pack.recap.backwards_options, `${pack.topic_pack_id} recap`);
    assert.ok(pack.apply.steps.length >= 3);
    assert.equal(pack.loop.steps.length, 3);
  });

  test(`${pack.title}: QA personas grade as their names say`, () => {
    for (const unit of pack.units) {
      const personas = unit.how_why_challenge.qa_personas;
      assert.equal(personas.length, 3, `${unit.topic_id}: 3 personas`);
      for (const p of personas) {
        const r = evaluateSplitRubric({ unit, howChoiceId: p.how_choice, whyText: p.why_text });
        const label = `${unit.topic_id} / ${p.name}`;
        assert.equal(r.check_a_prediction_pass, true, `${label}: persona picks the right prediction`);
        if (/Mastery/i.test(p.name)) {
          assert.equal(r.status, "graded", label);
          assert.equal(r.check_b_mechanism_pass, true, `${label}: mechanism should pass`);
        } else if (/Misconception/i.test(p.name)) {
          const tags = unit.how_why_challenge.rubric.known_misconceptions.map(m => m.tag);
          assert.ok(tags.includes(r.misconception_tag), `${label}: expected a known misconception tag, got ${r.misconception_tag}`);
        } else if (/Ambiguous/i.test(p.name)) {
          assert.equal(r.status, "needs_followup", `${label}: should ask the one clarifying follow-up`);
        }
      }
    }
  });

  test(`${pack.title}: a learner can reach mastery in every unit through the runtime`, () => {
    for (const unit of pack.units) {
      const s = new UnitRuntimeSession(unit, "test-learner");
      assert.equal(s.submitWhatGate(unit.what_gate.options.findIndex(o => o.correct)).passed, true);
      s.advanceToHowWhy();
      const p = unit.how_why_challenge.qa_personas[0];
      const r = s.submitHowWhy({ howChoiceId: p.how_choice, whyText: p.why_text });
      assert.equal(r.status, "graded", unit.topic_id);
      s.advanceToWhatIf();
      const w = s.submitWhatIf(unit.what_if_proof.options.findIndex(o => o.correct));
      assert.equal(w.mastery_state, "independent_mastery", unit.topic_id);
      assert.equal(s.advanceToConnect().allowed, true);
    }
  });

  test(`${pack.title}: the living object renders at every dial setting`, () => {
    for (const unit of pack.units) {
      assert.ok(hasVisual(unit.object_spec), `${unit.topic_id}: renderer for type '${unit.object_spec.type}'`);
      const { dial1, dial2 } = unit.object_spec.dials;
      for (let a = dial1.min; a <= dial1.max; a++) {
        for (let b = dial2.min; b <= dial2.max; b++) {
          const { svg, banner } = renderVisual(unit.object_spec, a, b);
          assert.ok(svg.startsWith("<svg") && banner.length > 0, `${unit.topic_id} @ ${a},${b}`);
          assert.ok(!/NaN|undefined|Infinity/.test(svg + banner), `${unit.topic_id} @ ${a},${b} has no NaN/undefined`);
        }
      }
    }
  });
}

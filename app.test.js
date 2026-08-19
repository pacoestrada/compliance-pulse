import test from "node:test";
import assert from "node:assert/strict";
import { CONTROLS, calculateAssessment } from "./app.js";

const answers = value => Object.fromEntries(CONTROLS.map(control => [control.id, value]));

test("todos los controles implantados producen 100 y estado sólido", () => {
  assert.deepEqual(calculateAssessment(answers("yes")).score, 100);
  assert.equal(calculateAssessment(answers("yes")).level, "Sólido");
});

test("controles parciales ponderan al 50%", () => {
  assert.equal(calculateAssessment(answers("partial")).score, 50);
});

test("las brechas se ordenan por impacto", () => {
  const result = calculateAssessment(answers("no"));
  assert.equal(result.level, "Prioridad alta");
  assert.equal(result.gaps[0].id, "privacy");
});

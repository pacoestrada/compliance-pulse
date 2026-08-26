import test from "node:test";
import assert from "node:assert/strict";
import {CATEGORIES,CONTROLS,calculateAssessment} from "./app.js";
const answers=value=>Object.fromEntries(CONTROLS.map(c=>[c.id,value]));
test("todas las respuestas positivas producen 100",()=>{const r=calculateAssessment(answers("yes"));assert.equal(r.score,100);assert.equal(r.level,"Buena base");assert.equal(r.gaps.length,0)});
test("las respuestas intermedias producen 50",()=>assert.equal(calculateAssessment(answers("partial")).score,50));
test("no aplica se excluye del cálculo",()=>{const a=answers("yes");a.online_sales="na";assert.equal(calculateAssessment(a).score,100)});
test("genera resultado para cada área",()=>{const r=calculateAssessment(answers("no"));assert.equal(r.categories.length,CATEGORIES.length);assert.ok(r.categories.every(c=>c.score===0))});
test("prioriza por impacto pendiente",()=>{const a=answers("yes");a.data_map="no";a.cookies="partial";assert.equal(calculateAssessment(a).gaps[0].id,"data_map")});

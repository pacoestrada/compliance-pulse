import test from "node:test";
import assert from "node:assert/strict";
import {CATEGORIES,CONTROLS,calculateAssessment} from "./app.js";
import {analyzePublicSignals,normalizePublicUrl} from "./scanner.js";
const answers=value=>Object.fromEntries(CONTROLS.map(c=>[c.id,value]));
test("todas las respuestas positivas producen 100",()=>{const r=calculateAssessment(answers("yes"));assert.equal(r.score,100);assert.equal(r.level,"Buena base");assert.equal(r.gaps.length,0)});
test("las respuestas intermedias producen 50",()=>assert.equal(calculateAssessment(answers("partial")).score,50));
test("no aplica se excluye del cálculo",()=>{const a=answers("yes");a.online_sales="na";assert.equal(calculateAssessment(a).score,100)});
test("genera resultado para cada área",()=>{const r=calculateAssessment(answers("no"));assert.equal(r.categories.length,CATEGORIES.length);assert.ok(r.categories.every(c=>c.score===0))});
test("prioriza por impacto pendiente",()=>{const a=answers("yes");a.data_map="no";a.cookies="partial";assert.equal(calculateAssessment(a).gaps[0].id,"data_map")});

test("normaliza dominios públicos y rechaza direcciones internas",()=>{
  assert.equal(normalizePublicUrl("empresa.es").href,"https://empresa.es/");
  assert.throws(()=>normalizePublicUrl("http://127.0.0.1"),/webs públicas/);
  assert.throws(()=>normalizePublicUrl("file:///etc/passwd"),/http o https/);
});

test("el escáner distingue evidencias, avisos y controles no aplicables",()=>{
  const content=`Title: Empresa Ejemplo

# Inicio
[Privacidad](https://empresa.es/privacidad)
[Política de cookies](https://empresa.es/cookies)
[Aviso legal](https://empresa.es/aviso-legal)
[Contacto](https://empresa.es/contacto)
Aceptar todas las cookies · Rechazar todas las cookies`;
  const result=analyzePublicSignals({
    url:"https://empresa.es",
    content,
    observatory:{score:90,grade:"A",tests_passed:10,tests_quantity:10,details_url:"https://developer.mozilla.org/en-US/observatory/analyze?host=empresa.es"},
    scannedAt:new Date("2026-09-01T10:00:00Z")
  });
  assert.equal(result.checks.find(item=>item.id==="privacy_policy").status,"pass");
  assert.equal(result.checks.find(item=>item.id==="cookie_choice").status,"pass");
  assert.equal(result.checks.find(item=>item.id==="online_sales").status,"na");
  assert.ok(result.score>=85);
  assert.ok(result.confidence>=75);
});

test("un fallo de proveedor reduce cobertura sin inventar evidencias",()=>{
  const result=analyzePublicSignals({url:"https://empresa.es",content:null,observatory:null});
  assert.equal(result.checks.find(item=>item.id==="privacy_policy").status,"unknown");
  assert.ok(result.confidence<25);
  assert.equal(result.providers.reader,false);
});

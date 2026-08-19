export const CONTROLS = [
  { id: "owner", label: "Responsable de compliance definido", weight: 15, recommendation: "Asigna un responsable con mandato y responsabilidades documentadas." },
  { id: "policies", label: "Políticas internas actualizadas", weight: 15, recommendation: "Revisa, aprueba y comunica las políticas clave al menos anualmente." },
  { id: "privacy", label: "Inventario y protección de datos personales", weight: 20, recommendation: "Documenta tratamientos, bases legales, plazos y medidas de protección." },
  { id: "thirdParties", label: "Evaluación de terceros y proveedores", weight: 15, recommendation: "Implanta un proceso de diligencia debida basado en riesgo para terceros." },
  { id: "training", label: "Formación periódica al equipo", weight: 10, recommendation: "Programa formación trazable y adaptada a los riesgos de cada función." },
  { id: "reporting", label: "Canal de denuncias operativo", weight: 15, recommendation: "Habilita un canal confidencial con protocolo de gestión y no represalias." },
  { id: "incidents", label: "Registro y respuesta ante incidentes", weight: 10, recommendation: "Define responsables, escalado, evidencias y aprendizaje posterior al incidente." }
];

export function calculateAssessment(answers) {
  const score = CONTROLS.reduce((total, control) => total + (answers[control.id] === "yes" ? control.weight : answers[control.id] === "partial" ? control.weight * 0.5 : 0), 0);
  const rounded = Math.round(score);
  const level = rounded >= 80 ? "Sólido" : rounded >= 55 ? "En desarrollo" : "Prioridad alta";
  const tone = rounded >= 80 ? "good" : rounded >= 55 ? "warning" : "critical";
  const gaps = CONTROLS.filter(control => answers[control.id] !== "yes").sort((a, b) => b.weight - a.weight);
  return { score: rounded, level, tone, gaps };
}

function renderControls() {
  const container = document.querySelector("#controls");
  CONTROLS.forEach((control, index) => {
    const row = document.createElement("div");
    row.className = "control-row";
    row.innerHTML = `<p><b>${String(index + 1).padStart(2, "0")}</b>${control.label}</p><div class="choices" role="radiogroup" aria-label="${control.label}">${[["yes", "Sí"], ["partial", "Parcial"], ["no", "No"]].map(([value, label]) => `<label><input type="radio" name="${control.id}" value="${value}" required><span>${label}</span></label>`).join("")}</div>`;
    container.appendChild(row);
  });
}

function renderResult(organization, sector, assessment) {
  const result = document.querySelector("#result");
  const priority = assessment.gaps.slice(0, 3);
  result.className = `panel result ${assessment.tone}`;
  result.innerHTML = `<div class="section-heading"><div><p class="step">03 · RESULTADO</p><h2>${organization}</h2><p class="sector">${sector}</p></div><div class="score" aria-label="Score ${assessment.score} sobre 100"><strong>${assessment.score}</strong><small>/100</small></div></div><div class="status"><span>${assessment.level}</span><p>${assessment.score >= 80 ? "Buena base de control. Mantén la evidencia y revisa los puntos pendientes." : assessment.score >= 55 ? "La base existe, pero quedan controles relevantes por consolidar." : "Hay brechas relevantes que conviene priorizar y asignar."}</p></div><div class="recommendations"><h3>Próximas acciones prioritarias</h3>${priority.length ? `<ol>${priority.map(item => `<li><span>${item.label}</span><p>${item.recommendation}</p></li>`).join("")}</ol>` : "<p>Todos los controles declarados están implantados. Valida evidencias y eficacia periódicamente.</p>"}</div>`;
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

if (typeof document !== "undefined") {
  renderControls();
  const form = document.querySelector("#assessment-form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const answers = Object.fromEntries(CONTROLS.map(control => [control.id, data.get(control.id)]));
    renderResult(data.get("organization").trim(), data.get("sector"), calculateAssessment(answers));
  });
  document.querySelector("#reset").addEventListener("click", () => {
    form.reset();
    document.querySelector("#result").hidden = true;
    document.querySelector("#organization").focus();
  });
}

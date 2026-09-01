export const SCAN_CATEGORIES = [
  { id: "legal", title: "Legal y transparencia", short: "Legal", color: "#8b7cff" },
  { id: "privacy", title: "Privacidad y cookies", short: "Privacidad", color: "#26c6a0" },
  { id: "security", title: "Seguridad web", short: "Seguridad", color: "#4aa8ff" },
  { id: "quality", title: "Confianza y accesibilidad", short: "Confianza", color: "#f4b75f" }
];

const STATUS_VALUE = { pass: 1, warn: 0.5, fail: 0, unknown: null, na: null };
const PRIVATE_IPV4 = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./
];

export function normalizePublicUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) throw new Error("Escribe la dirección de la web.");
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("La dirección no parece válida. Prueba, por ejemplo, con empresa.es");
  }
  if (!/^https?:$/.test(url.protocol)) throw new Error("Solo podemos analizar páginas web http o https.");
  if (url.username || url.password) throw new Error("No uses direcciones que incluyan usuario o contraseña.");
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".local") || host === "::1" || PRIVATE_IPV4.some(rule => rule.test(host))) {
    throw new Error("Por seguridad, solo analizamos webs públicas de Internet.");
  }
  url.hash = "";
  return url;
}

const found = (text, patterns) => patterns.some(pattern => pattern.test(text));
const linkFound = (text, terms) => {
  const links = [...text.matchAll(/\[([^\]]+)]\((https?:\/\/[^)]+)\)/gi)];
  return links.find(([, label, href]) => terms.some(term => term.test(`${label} ${href}`))) || null;
};
const excerpt = (text, pattern, fallback) => {
  const match = text.match(pattern);
  if (!match) return fallback;
  const start = Math.max(0, match.index - 55);
  return text.slice(start, start + 185).replace(/\s+/g, " ").trim();
};
const check = (data) => ({ status: "unknown", evidence: "No se pudo comprobar automáticamente.", ...data });

export function analyzePublicSignals({ url, content = null, observatory = null, scannedAt = new Date() }) {
  const target = url instanceof URL ? url : normalizePublicUrl(url);
  const text = typeof content === "string" ? content.replace(/\u0000/g, " ") : "";
  const lower = text.toLocaleLowerCase("es");
  const hasContent = text.length > 80;
  const privacyLink = hasContent && linkFound(lower, [/privacidad/, /protecci[oó]n[-_ ]de[-_ ]datos/, /privacy/]);
  const cookieLink = hasContent && linkFound(lower, [/cookie/, /galleta/]);
  const legalLink = hasContent && linkFound(lower, [/aviso[-_ ]legal/, /informaci[oó]n[-_ ]legal/, /legal[-_ ]notice/, /impressum/]);
  const termsLink = hasContent && linkFound(lower, [/condiciones/, /t[eé]rminos/, /devoluci[oó]n/, /desistimiento/, /terms/, /refund/]);
  const contactLink = hasContent && linkFound(lower, [/contact/, /escr[ií]benos/, /atenci[oó]n[-_ ]al[-_ ]cliente/]);
  const privacyMention = found(lower, [/pol[ií]tica de privacidad/, /protecci[oó]n de datos/, /privacy policy/]);
  const cookieMention = found(lower, [/pol[ií]tica de cookies/, /uso de cookies/, /cookie policy/, /preferencias de cookies/]);
  const acceptCookies = found(lower, [/aceptar(?: todas)?(?: las)? cookies/, /acepto(?: todas)?/, /accept all(?: cookies)?/]);
  const rejectCookies = found(lower, [/rechazar(?: todas)?(?: las)? cookies/, /denegar(?: todas)?/, /reject all(?: cookies)?/, /solo necesarias/]);
  const formSignals = found(lower, [/formulario/, /enviar mensaje/, /solicitar presupuesto/, /suscr[ií]bete/, /newsletter/, /nombre.{0,80}(correo|email)/s]);
  const salesSignals = found(lower, [/añadir al carrito/, /finalizar compra/, /checkout/, /comprar ahora/, /precio (final|total)/, /\b\d+[,.]?\d*\s?€/, /venta online/]);
  const termsMention = found(lower, [/condiciones (de contrataci[oó]n|generales|de venta)/, /derecho de desistimiento/, /pol[ií]tica de devoluciones/, /terms and conditions/, /refund policy/]);
  const identitySignals = found(lower, [/\b(?:nif|cif|nie|c\.i\.f\.)\b/, /raz[oó]n social/, /registro mercantil/, /domicilio social/, /titular del sitio/]);
  const contactSignals = Boolean(contactLink) || found(lower, [/mailto:/, /tel:/, /\bcontacto\b/, /atenci[oó]n al cliente/, /escr[ií]benos/]);
  const title = text.match(/^Title:\s*(.+)$/im)?.[1]?.trim();
  const headings = (text.match(/^#{1,4}\s+.+$/gm) || []).length;
  const obsOk = observatory && !observatory.error && Number.isFinite(Number(observatory.score));
  const grade = obsOk ? String(observatory.grade || "—").toUpperCase() : null;

  const checks = [
    check({
      id: "reachable", category: "quality", weight: 4, title: "Contenido público accesible",
      status: hasContent ? "pass" : "unknown",
      evidence: hasContent ? `Se pudo leer contenido público (${Math.min(text.length, 99999).toLocaleString("es-ES")} caracteres).` : "La web bloqueó la lectura o el servicio no respondió.",
      recommendation: "Comprueba que la web sea accesible para personas y rastreadores legítimos.", source: "Lectura pública"
    }),
    check({
      id: "https", category: "security", weight: 10, title: "Conexión HTTPS",
      status: target.protocol === "https:" ? "pass" : "fail",
      evidence: target.protocol === "https:" ? "La dirección utiliza una conexión cifrada HTTPS." : "La dirección analizada comienza por HTTP sin cifrar.",
      recommendation: "Activa HTTPS y redirige automáticamente todo el tráfico HTTP.", source: "Dirección analizada"
    }),
    check({
      id: "security_headers", category: "security", weight: 9, title: "Defensas del navegador",
      status: obsOk ? (/^[AB]/.test(grade) ? "pass" : /^[CD]/.test(grade) ? "warn" : "fail") : "unknown",
      evidence: obsOk ? `MDN HTTP Observatory: grado ${grade}, ${observatory.tests_passed ?? "—"} de ${observatory.tests_quantity ?? "—"} pruebas superadas.` : "MDN HTTP Observatory no devolvió un resultado utilizable.",
      recommendation: "Revisa CSP, HSTS, protección frente a marcos y las demás cabeceras señaladas por MDN.",
      source: "MDN HTTP Observatory", sourceUrl: observatory?.details_url
    }),
    check({
      id: "privacy_policy", category: "privacy", weight: 9, title: "Política de privacidad localizable",
      status: !hasContent ? "unknown" : privacyLink ? "pass" : privacyMention ? "warn" : "fail",
      evidence: privacyLink ? `Enlace localizado: “${privacyLink[1].slice(0, 90)}”.` : privacyMention ? "Se habla de privacidad, pero no se ha podido confirmar un enlace claro a la política." : "No se detectó un enlace o mención clara a la política de privacidad.",
      recommendation: "Publica una política de privacidad clara y enlázala desde formularios y el pie de página.", source: "Contenido visible"
    }),
    check({
      id: "cookie_policy", category: "privacy", weight: 7, title: "Información sobre cookies",
      status: !hasContent ? "unknown" : cookieLink ? "pass" : cookieMention ? "warn" : "fail",
      evidence: cookieLink ? `Enlace localizado: “${cookieLink[1].slice(0, 90)}”.` : cookieMention ? "Se mencionan cookies, pero no se ha confirmado una política enlazada." : "No se detectó información visible sobre cookies.",
      recommendation: "Explica qué cookies se usan, su finalidad, duración y posibles terceros.", source: "Contenido visible"
    }),
    check({
      id: "cookie_choice", category: "privacy", weight: 9, title: "Elección sobre cookies",
      status: !hasContent ? "unknown" : acceptCookies && rejectCookies ? "pass" : cookieMention ? "warn" : "unknown",
      evidence: acceptCookies && rejectCookies ? "Se localizaron indicios de opciones para aceptar y rechazar cookies." : cookieMention ? "Hay referencias a cookies, pero no se han confirmado opciones equivalentes de aceptar y rechazar." : "Sin indicios suficientes para saber si se instalan cookies no necesarias.",
      recommendation: "Si hay cookies no necesarias, ofrece aceptar y rechazar al mismo nivel y permite configurar por finalidad.", source: "Contenido visible"
    }),
    check({
      id: "legal_identity", category: "legal", weight: 8, title: "Identidad del responsable",
      status: !hasContent ? "unknown" : legalLink ? "pass" : identitySignals ? "warn" : "fail",
      evidence: legalLink ? `Aviso legal localizado: “${legalLink[1].slice(0, 90)}”.` : identitySignals ? "Se encontraron datos de identidad, pero no se ha confirmado que estén completos." : "No se localizaron señales claras de aviso legal o identificación empresarial.",
      recommendation: "Identifica al titular con nombre o razón social, NIF, domicilio, contacto y datos registrales cuando proceda.", source: "Contenido visible"
    }),
    check({
      id: "forms_notice", category: "privacy", weight: 8, title: "Información junto a formularios",
      status: !hasContent ? "unknown" : !formSignals ? "na" : privacyLink ? "pass" : privacyMention ? "warn" : "fail",
      evidence: !hasContent ? "No se pudo revisar." : !formSignals ? "No se han detectado formularios en el contenido analizado." : privacyLink ? "Se detectan formularios y también acceso a información de privacidad." : "Se detectan señales de formularios sin poder confirmar la información de privacidad junto a ellos.",
      recommendation: "Añade una primera capa informativa visible junto a cada formulario que recoja datos.", source: "Contenido visible"
    }),
    check({
      id: "online_sales", category: "legal", weight: 7, title: "Condiciones de venta online",
      status: !hasContent ? "unknown" : !salesSignals ? "na" : termsLink ? "pass" : termsMention ? "warn" : "fail",
      evidence: !hasContent ? "No se pudo revisar." : !salesSignals ? "No se han detectado señales claras de venta online." : termsLink ? `Enlace localizado: “${termsLink[1].slice(0, 90)}”.` : termsMention ? "Se mencionan condiciones o devoluciones, pero no se ha confirmado un acceso claro." : "Hay señales de venta online sin condiciones o devoluciones localizables.",
      recommendation: "Muestra precio total, condiciones, plazos, devoluciones y desistimiento antes del pago.", source: "Contenido visible"
    }),
    check({
      id: "contact", category: "quality", weight: 5, title: "Contacto localizable",
      status: !hasContent ? "unknown" : contactSignals ? "pass" : "fail",
      evidence: contactSignals ? "Se ha localizado una vía o sección de contacto." : "No se detectó una vía clara de contacto en el contenido analizado.",
      recommendation: "Facilita una vía de contacto clara, estable y fácil de encontrar.", source: "Contenido visible"
    }),
    check({
      id: "structure", category: "quality", weight: 5, title: "Título y estructura comprensible",
      status: !hasContent ? "unknown" : title && headings > 0 ? "pass" : title || headings > 0 ? "warn" : "fail",
      evidence: title && headings > 0 ? `Título detectado y ${headings} encabezados que organizan el contenido.` : title ? "Hay título, pero no se ha confirmado una estructura clara de encabezados." : headings ? `Se detectan ${headings} encabezados, pero no un título fiable.` : "No se han podido confirmar título y encabezados.",
      recommendation: "Usa un título descriptivo y una jerarquía de encabezados coherente; revisa además contraste, teclado y textos alternativos.", source: "Contenido visible"
    })
  ];

  const categories = SCAN_CATEGORIES.map(category => {
    const applicable = checks.filter(item => item.category === category.id && STATUS_VALUE[item.status] !== null);
    const possible = applicable.reduce((sum, item) => sum + item.weight, 0);
    const earned = applicable.reduce((sum, item) => sum + item.weight * STATUS_VALUE[item.status], 0);
    return { ...category, score: possible ? Math.round(earned / possible * 100) : null, checked: applicable.length };
  });
  const scored = checks.filter(item => STATUS_VALUE[item.status] !== null);
  const possible = scored.reduce((sum, item) => sum + item.weight, 0);
  const earned = scored.reduce((sum, item) => sum + item.weight * STATUS_VALUE[item.status], 0);
  const totalWeight = checks.reduce((sum, item) => sum + item.weight, 0);
  const score = possible ? Math.round(earned / possible * 100) : null;
  const confidence = Math.round(possible / totalWeight * 100);
  const actions = checks
    .filter(item => item.status === "fail" || item.status === "warn")
    .sort((a, b) => (b.status === "fail") - (a.status === "fail") || b.weight - a.weight);
  const level = score === null ? "Sin datos suficientes" : score >= 80 ? "Base digital sólida" : score >= 60 ? "Buen punto de partida" : score >= 40 ? "Hay brechas visibles" : "Prioridad alta";
  return {
    url: target.href, host: target.hostname.replace(/^www\./, ""), scannedAt: new Date(scannedAt), score, confidence,
    level, checks, categories, actions, providers: { reader: hasContent, observatory: Boolean(obsOk) },
    evidencePreview: hasContent ? excerpt(text, /(privacidad|cookies|aviso legal|contacto)/i, "Contenido público analizado.") : null
  };
}

async function withTimeout(promiseFactory, milliseconds) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), milliseconds);
  try { return await promiseFactory(controller.signal); }
  finally { clearTimeout(timer); }
}

export async function scanWebsite(value, onProgress = () => {}) {
  const url = normalizePublicUrl(value);
  onProgress({ stage: "starting", message: "Preparando una comprobación segura…" });
  const readerPromise = withTimeout(async signal => {
    onProgress({ stage: "content", message: "Localizando políticas, formularios y señales visibles…" });
    const response = await fetch(`https://r.jina.ai/${url.href}`, { signal, headers: { DNT: "1", "X-Locale": "es-ES" } });
    if (!response.ok) throw new Error(`Lectura pública: ${response.status}`);
    return response.text();
  }, 45000);
  const securityPromise = withTimeout(async signal => {
    onProgress({ stage: "security", message: "Revisando HTTPS y defensas del navegador con MDN…" });
    const endpoint = `https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${encodeURIComponent(url.hostname)}`;
    const response = await fetch(endpoint, { method: "POST", signal });
    if (!response.ok) throw new Error(`Observatorio: ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(data.message || data.error);
    return data;
  }, 45000);
  const [reader, security] = await Promise.allSettled([readerPromise, securityPromise]);
  onProgress({ stage: "scoring", message: "Ordenando evidencias y calculando prioridades…" });
  const report = analyzePublicSignals({
    url,
    content: reader.status === "fulfilled" ? reader.value : null,
    observatory: security.status === "fulfilled" ? security.value : null
  });
  report.errors = [
    reader.status === "rejected" ? `Contenido: ${reader.reason?.message || "no disponible"}` : null,
    security.status === "rejected" ? `Seguridad: ${security.reason?.message || "no disponible"}` : null
  ].filter(Boolean);
  return report;
}

# Compliance Pulse

Radar de señales públicas y diagnóstico guiado de cumplimiento para pequeñas y medianas empresas españolas sin conocimientos previos. Convierte lo que una web deja ver —y lo que el negocio confirma— en un scoring explicable, un panel ejecutivo y una hoja de ruta priorizada.

> **Beta orientativa:** no sustituye asesoramiento jurídico, una auditoría, un análisis de vulnerabilidades ni una certificación.

## Probar la beta

La forma recomendada de probar Compliance Pulse es abrirla en el navegador:

### [Abrir Compliance Pulse](https://pacoestrada.github.io/compliance-pulse/)

No requiere instalación, descarga ni registro. Los paquetes para Linux (`.deb` y Flatpak) están previstos para una fase posterior.

## Qué incluye la beta 0.3

- Análisis de cualquier URL pública `http` o `https`.
- Lectura de señales visibles: políticas, cookies, aviso legal, formularios, contacto y venta online.
- Revisión real de HTTPS y cabeceras defensivas mediante MDN HTTP Observatory.
- Score web de 0 a 100 con cobertura del análisis separada del resultado.
- Panel visual por áreas, plan de choque y registro filtrable de evidencias.
- Historial local de los últimos análisis para mostrar evolución.
- Diagnóstico interno de 17 preguntas en lenguaje cotidiano.
- Pulso integral opcional: 35% señales públicas y 65% diagnóstico interno.
- Informe adaptable a móvil y preparado para guardar como PDF desde el navegador.
- Tolerancia a fallos: una fuente no disponible reduce la cobertura y nunca se convierte en una evidencia inventada.

## Cómo funciona

La aplicación es estática y puede alojarse en GitHub Pages. Al analizar una web realiza dos consultas desde el navegador:

1. **Jina Reader** convierte el contenido público en texto para localizar indicios visibles. La petición incluye la preferencia `DNT`.
2. **MDN HTTP Observatory** comprueba cabeceras y prácticas defensivas del dominio.

El motor clasifica cada control como `Detectado`, `Revisar`, `Prioridad`, `No comprobado` o `No observado`. Las señales no aplicables y las que no se han podido comprobar se excluyen del score; su ausencia reduce la cobertura.

Consulta [METHODOLOGY.md](METHODOLOGY.md) para ver controles, pesos, límites y fórmula.

## Datos y privacidad

- La URL pública y el nombre de host se transmiten a Jina Reader y MDN HTTP Observatory para realizar el análisis.
- Las respuestas del diagnóstico, el nombre de empresa, el sector y el tamaño no se envían a ningún servidor.
- El navegador conserva localmente hasta 24 resúmenes —dominio, score y fecha— para mostrar tendencia.
- Compliance Pulse no crea cuentas ni instala cookies propias.

Consulta [PRIVACY.md](PRIVACY.md) para conocer el flujo de datos y cómo borrar el historial local.

## Ejecutar en local

No requiere instalar dependencias. Con Python 3:

```bash
npm start
```

Abre [http://localhost:4173](http://localhost:4173).

## Pruebas

Requiere Node.js 18 o superior:

```bash
npm test
```

Las pruebas cubren scoring, respuestas `No aplica`, priorización, normalización segura de URL, bloqueo de destinos locales, detección de señales y degradación cuando falla un proveedor.

## Fuentes y criterio

- [Orientación para pymes de la AEPD](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes)
- [Guía sobre el uso de cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf)
- [Recursos para empresas de INCIBE](https://www.incibe.es/empresas)
- [MDN HTTP Observatory](https://developer.mozilla.org/en-US/observatory)
- [Ley 2/2023, de protección de las personas informantes](https://boe.es/eli/es/l/2023/02/20/2/con)

`Detectado` significa que existe un indicio público, no que el contenido sea completo o jurídicamente correcto. `No detectado` tampoco demuestra su inexistencia: algunas páginas bloquean lectores, cargan contenido de forma dinámica o ubican información fuera de la portada.

## Estructura

```text
index.html       Interfaz y estructura semántica
styles.css       Sistema visual, dashboard, móvil e impresión
app.js           Diagnóstico interno, informes e interacción
scanner.js       URL segura, proveedores, evidencias y scoring web
app.test.js      Pruebas automáticas del motor
METHODOLOGY.md   Método, pesos y límites
PRIVACY.md       Flujo de datos y privacidad
CHANGELOG.md     Evolución de versiones
```

## Próximos pasos

1. Backend propio para controlar disponibilidad, auditoría de proveedores y límites de uso.
2. Análisis multipágina y validación más precisa de políticas y formularios.
3. Evidencias, responsables, fechas objetivo y seguimiento de acciones.
4. Perfiles normativos configurables y revisión del scoring por especialistas.
5. Exportación PDF nativa y paquetes instalables para Linux.

## Versión

`0.3.1-beta.1`

## Licencia

MIT. Consulta [LICENSE](LICENSE).

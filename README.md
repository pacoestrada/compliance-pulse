# Compliance Pulse

Beta funcional de una evaluación guiada de compliance para pequeñas y medianas empresas españolas sin conocimientos previos. Traduce situaciones cotidianas del negocio en un mapa orientativo de riesgos y próximos pasos.

> **Beta orientativa:** no sustituye asesoramiento jurídico ni una auditoría formal.

## Probar ahora

La forma recomendada de probar esta beta es abrirla directamente en el navegador:

### [Abrir Compliance Pulse](https://pacoestrada.github.io/compliance-pulse/)

No requiere instalación, descarga ni registro. Los datos introducidos se procesan únicamente en el navegador.

Los paquetes instalables para Linux (`.deb` y Flatpak) están previstos para una fase posterior del proyecto.

## Ejecutar

No requiere dependencias. Con Python 3:

```bash
npm start
```

Abre [http://localhost:4173](http://localhost:4173). Servirlo por HTTP evita las restricciones que algunos navegadores aplican a los módulos JavaScript abiertos directamente desde disco.

## Pruebas

Requiere Node.js 18 o superior:

```bash
npm test
```

## Alcance de la beta

- Recorrido guiado de seis pasos con 17 preguntas en lenguaje cotidiano.
- Cinco áreas: clientes y web, datos personales, equipo, proveedores y seguridad.
- Respuestas claras: Sí, A medias / no estoy seguro, No y No aplica.
- Score ponderado de 0 a 100.
- Puntuación desglosada por áreas.
- Cinco acciones prioritarias con explicación del riesgo que ayudan a reducir.
- Informe imprimible.
- Diseño adaptable a móvil y accesibilidad básica.
- Sin recogida ni envío de datos: todo se procesa en el navegador.

## Criterio y fuentes

El diagnóstico se basa en una matriz orientativa elaborada a partir de materiales públicos para pymes de la Agencia Española de Protección de Datos (AEPD), recomendaciones de ciberseguridad de INCIBE y normativa española aplicable, incluida la Ley 2/2023 para sistemas internos de información.

No inspecciona la web ni los documentos de la empresa y no certifica el cumplimiento. El resultado depende de las respuestas declaradas y debe validarse con evidencias y asesoramiento profesional cuando proceda.

## Estructura

```text
index.html      Interfaz
styles.css      Diseño visual adaptable
app.js          Controles, cálculo y presentación
app.test.js     Pruebas del motor de scoring
```

## Próximos pasos

1. Preparar paquetes instalables para Linux (`.deb` y Flatpak).
2. Persistir evaluaciones y permitir exportarlas.
3. Añadir perfiles normativos configurables (RGPD, ISO 27001, canal de denuncias).
4. Incorporar evidencias, responsables y fechas objetivo.
5. Validar el modelo de scoring con especialistas.

## Versión

`0.2.0-beta.1`

## Licencia

MIT. Consulta [LICENSE](LICENSE).

# Compliance Pulse

Primera beta funcional de una evaluación rápida y explicable de compliance. Permite identificar una organización, responder siete controles y recibir un score ponderado, un estado y tres acciones prioritarias.

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

- Evaluación de siete controles con respuesta Sí / Parcial / No.
- Score ponderado de 0 a 100.
- Clasificación en Prioridad alta, En desarrollo o Sólido.
- Recomendaciones ordenadas por impacto.
- Diseño adaptable a móvil y accesibilidad básica.
- Sin recogida ni envío de datos: todo se procesa en el navegador.

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

`0.1.0-beta.1`

## Licencia

MIT. Consulta [LICENSE](LICENSE).

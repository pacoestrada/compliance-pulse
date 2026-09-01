# Metodología de scoring

Compliance Pulse separa tres conceptos que suelen confundirse:

- **Señal:** indicio público localizado en la URL analizada.
- **Score:** fortaleza orientativa de las señales que sí se han podido comprobar.
- **Cobertura:** proporción del peso total para la que existe información utilizable.

Una cobertura baja nunca debe interpretarse como un buen resultado. El panel muestra ambos valores por separado.

## Estados

| Estado | Valor | Significado |
| --- | ---: | --- |
| Detectado | 1 | Existe un indicio público razonable. Requiere validar calidad y vigencia. |
| Revisar | 0,5 | Hay una señal parcial, ambigua o incompleta. |
| Prioridad | 0 | No se localiza una señal esperable en el contenido disponible. |
| No comprobado | Excluido | El proveedor falló, la web bloqueó el acceso o no hay información suficiente. |
| No observado | Excluido | No se detecta el supuesto que haría aplicable el control, por ejemplo venta online. |

## Controles automáticos

| Área | Control | Peso |
| --- | --- | ---: |
| Confianza | Contenido público accesible | 4 |
| Seguridad | Conexión HTTPS | 10 |
| Seguridad | Defensas del navegador evaluadas por MDN | 9 |
| Privacidad | Política de privacidad localizable | 9 |
| Privacidad | Información sobre cookies | 7 |
| Privacidad | Opciones equivalentes de aceptar y rechazar cookies | 9 |
| Legal | Identidad del responsable | 8 |
| Privacidad | Información junto a formularios | 8 |
| Legal | Condiciones de venta online | 7 |
| Confianza | Contacto localizable | 5 |
| Confianza | Título y estructura comprensible | 5 |

El score global es la suma ponderada de los valores dividida por el peso de los controles aplicables y comprobados. La cobertura es el peso comprobado dividido por el peso total de los once controles.

Los scores por área utilizan la misma fórmula sólo con sus controles. El plan de choque ordena primero los estados `Prioridad` y después `Revisar`; dentro de cada estado usa el peso como aproximación de impacto.

## Pulso integral

Cuando una persona completa el diagnóstico después de analizar una URL, se muestra un resultado combinado:

```text
Pulso integral = 35% score web + 65% diagnóstico interno
```

La mayor ponderación interna refleja que una web no puede demostrar inventarios de datos, contratos con proveedores, control de accesos, copias de seguridad, formación o respuesta a incidentes.

## Límites conocidos

- Se analiza la URL introducida, no todo el dominio.
- La detección textual puede producir falsos positivos o falsos negativos.
- Una política enlazada puede estar desactualizada o ser jurídicamente insuficiente.
- La presencia de controles de cookies no acredita su comportamiento técnico antes del consentimiento.
- HTTP Observatory evalúa cabeceras defensivas, no vulnerabilidades ni la seguridad completa del sistema.
- Algunos sitios bloquean lectores automáticos o renderizan elementos que no aparecen en el contenido extraído.
- El modelo está diseñado para orientación inicial y debe validarse con especialistas antes de usarse para decisiones de alto impacto.

## Versionado

Los pesos y patrones pertenecen a la beta `0.3.0-beta.1`. Cualquier cambio material del modelo debe quedar reflejado en el changelog y en una nueva versión.

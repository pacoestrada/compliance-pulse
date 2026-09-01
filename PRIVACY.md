# Privacidad y flujo de datos

Compliance Pulse funciona como una aplicación estática en el navegador. No tiene cuentas, base de datos propia ni backend en esta beta.

## Al analizar una URL

La dirección pública introducida se envía a:

- **Jina Reader**, para extraer contenido público legible. Compliance Pulse añade la preferencia `DNT` documentada por el proveedor.
- **MDN HTTP Observatory**, para analizar las cabeceras defensivas del dominio.

Estos servicios reciben la URL o el nombre de host y la información técnica normal de una petición web, como la dirección IP. Sus condiciones y prácticas son ajenas a Compliance Pulse. No introduzcas direcciones privadas, paneles internos ni URLs que contengan tokens; el producto las desaconseja y bloquea credenciales explícitas, `localhost` e intervalos IPv4 privados conocidos.

## Al completar el diagnóstico

El nombre de empresa, sector, tamaño, canal de venta y las 17 respuestas se procesan exclusivamente en la pestaña. No se transmiten a Jina, MDN, GitHub ni a un servidor de Compliance Pulse.

## Almacenamiento local

Para mostrar una pequeña tendencia, el navegador conserva como máximo 24 resúmenes con:

- dominio analizado;
- score web;
- fecha y hora.

No se almacenan las respuestas del diagnóstico. Para borrar el historial, elimina los datos del sitio `pacoestrada.github.io` desde la configuración de privacidad del navegador.

## Alojamiento

La aplicación se distribuye mediante GitHub Pages. GitHub puede procesar registros técnicos de acceso conforme a sus propias políticas.

## Alcance

Esta nota describe la beta `0.3.1-beta.1`. Antes de convertirla en un servicio comercial deberá existir una política formal, una evaluación de proveedores, plazos de conservación y un mecanismo directo de ejercicio de derechos.

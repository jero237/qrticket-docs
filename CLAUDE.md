# Guía qrTicket — documentación

Documentación de usuario de **qrTicket**, plataforma de ticketing para eventos (Argentina/LATAM).
Hecha con **Mintlify**. Se publica en https://docs.qrticket.app.

## Relación de trabajo
- Podés cuestionar ideas — eso mejora la documentación. Cuando lo hagas, citá la fuente y explicá tu razonamiento.
- SIEMPRE pedí aclaración en lugar de asumir.
- NUNCA inventes, adivines ni mientas. Si no estás seguro de cómo funciona una pantalla del producto, preguntá.

## Idioma y voz (importante)
- **Todo el contenido se escribe en español**, con voz rioplatense ("vos"): "registrate", "podés", "necesitás", "creá tu evento".
- Segunda persona, dirigiéndote al organizador.
- Tono cercano y claro, sin tecnicismos innecesarios. Es una guía para usuarios no técnicos.
- Mantené la terminología del producto consistente (ver glosario abajo).

## Contexto del producto
qrTicket permite a organizadores: crear entradas digitales con QR, venderlas (MercadoPago / transferencia bancaria / WhatsApp), y validarlas en la puerta con un scanner. **No cobra comisión por venta** — el organizador paga créditos.

Glosario (usar SIEMPRE estos términos):
- **Productora** — "carpeta" que agrupa eventos; tiene su propio equipo, créditos y configuración.
- **Créditos** — moneda interna. **1 crédito = 1 entrada QR**. Se compran una vez y se usan al generar entradas.
- **Evento** — cada actividad; puede tener varios tipos de entrada y precios.
- **Scanner** — herramienta para validar entradas el día del evento (web o link compartible).
- Medios de cobro: **MercadoPago**, **transferencia bancaria**, **WhatsApp**.

## Estructura del proyecto
- Páginas: archivos **`.mdx`** con frontmatter YAML, en la raíz y en `credits/`, `organizations/`, `events/`.
- Navegación y configuración: **`docs.json`** (tema, colores, tabs, grupos, navbar).
- Imágenes: `images/`. Logos: `logo/`.
- **NO editar** `.agents/` ni `crawler/` — `.agents/skills/mintlify/` es la referencia oficial de Mintlify (vendoreada, gitignoreada). Consultala como referencia de componentes/sintaxis, pero nunca la modifiques ni la agregues a la navegación.

## Frontmatter requerido en cada página
```yaml
---
title: "Título claro y descriptivo"
description: "Resumen conciso para SEO y navegación"
icon: "nombre-de-icono"   # icono Font Awesome, ej: "qrcode", "building", "coins"
---
```
- Después del frontmatter, abrí con un `# H1` que coincida con el `title`.

## Estándares de escritura
- Buscá contenido existente antes de crear algo nuevo — evitá duplicar.
- Hacé los cambios más chicos y razonables posibles. Seguí los patrones de las páginas existentes.
- Prerrequisitos al inicio del contenido procedural.
- Componentes Mintlify disponibles (ver `.agents/skills/mintlify/components/` para sintaxis): `Card`/`CardGroup`, `Accordion`/`AccordionGroup`, `Steps`/`Step`, `Frame`, `Tabs`, `Note`/`Warning`/`Tip`/`Info`, `CodeGroup`.
- Bloques de código siempre con etiqueta de lenguaje.
- Toda imagen con `alt`. Usá `<Frame>` para capturas de pantalla.
- Enlaces internos con **rutas relativas** (ej: `/events/scanner`), nunca URLs absolutas.

## docs.json
- Toda página nueva debe agregarse a la navegación en `docs.json` (en el grupo correcto: "Guía Rápida", "Tu cuenta", "Créditos", "Productoras", "Eventos").
- Las rutas en `docs.json` son sin extensión y relativas a la raíz (ej: `events/scanner`).
- Ante dudas de esquema, consultá https://mintlify.com/docs.json

## Flujo de Git
- Preguntá cómo manejar cambios sin commitear antes de empezar.
- Creá una rama nueva cuando no haya una rama clara para los cambios.
- Commiteá seguido, con mensajes claros en español.
- NUNCA uses `--no-verify` ni saltees hooks de pre-commit.

## No hacer
- No dejar páginas `.mdx` sin frontmatter.
- No usar URLs absolutas para enlaces internos.
- No editar `.agents/` ni `crawler/`.
- No escribir contenido en inglés.
- No asumir cómo funciona el producto — preguntá.

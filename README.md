# RivalFit — Sitio oficial

Sitio de descarga y presentación de RivalFit: convierte el entrenamiento en
una competencia real con tu liga. Liga privada con ranking semanal, retos
1v1 y verificación de repeticiones por visión por computadora (on-device,
anti-trampas).

Sección de descarga del APK de la beta para Android: el botón se habilita
automáticamente cuando existe el release en `public/apk/` y muestra el
SHA-256 verificado desde `SHA256SUMS`.

## Stack

- **Framework:** Astro 7 (output estático) + TypeScript estricto
- **Estilos:** Tailwind CSS v4 (design tokens en `src/styles/global.css`)
- **Tipografía:** Inter, Space Grotesk y JetBrains Mono auto-hosteada

## Requisitos

Node.js 20+ (cualquier versión reciente de npm).

## Dev setup

1. Clona el repo:

   ```sh
   git clone https://github.com/Crisls24/rivalfit-site.git
   cd rivalfit-site
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Corre el servidor de desarrollo:

   ```sh
   npm run dev
   ```

Comandos útiles:

| Comando           | Qué hace                              |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Servidor de desarrollo en :4321       |
| `npm run build`   | Genera `dist/` (estático)             |
| `npm run preview` | Sirve `dist/` localmente              |
| `npm run check`   | Type-check + diagnósticos de Astro    |

## Estructura

```
src/
  pages/        index.astro (una sola página)
  components/   Hero, HowItWorks (pilares + liga), AntiCheat, Download, Faq, Nav, Footer, Logo
  layouts/      Layout.astro (head SEO/OG + reveal on scroll)
  lib/          site.ts (URLs, versión, contacto — fuente única)
  styles/       global.css (tokens del brand kit)
public/
  assets/videos/   clips de demostración + poster
  apk/             contrato de descarga (ver abajo)
scripts/
  gen-og.mjs       regenera public/og.png
  gen-poster.ps1   extrae el poster real desde el clip de video
```

El contenido del sitio vive en `src/components/` y `src/lib/site.ts`;
los datos de sección no se repiten en más de un archivo.

## Descarga del APK

La sección de descarga lee `public/apk/SHA256SUMS` para mostrar el hash y
habilitar el botón cuando existe el release. El contrato y los pasos para
publicar una versión están documentados en `public/apk/README.md`.

> Excepto el contrato (`README.md`), los archivos `public/apk/` no se
> versionan: el APK firmado y su checksum se copian en el despliegue.

## Assets

- **Vídeos:** clips de stock bajo `public/assets/videos/` (licencia Coverr,
  sin atribución requerida).
- **Poster:** `workout-demo-poster.jpg` es un frame real del clip; se
  regenera con `scripts/gen-poster.ps1` (requiere el clip en el mismo folder).
- **OG image:** `public/og.png` se regenera con `scripts/gen-og.mjs`.
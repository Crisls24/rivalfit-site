# RivalFit — Sitio oficial

Landing oficial y canal de descarga de RivalFit: la app Android que convierte
el entrenamiento en una competencia real con tus amigos. Ligas privadas de
hasta 10 personas, ranking semanal y validación de repeticiones con visión por
computadora directamente en el teléfono.

Sitio estático de una sola página, sin backend ni llamadas a APIs en tiempo de
ejecución. Dominio configurado: <https://rivalfit.iscx.site>.

## Qué incluye

- **Landing completa:** Hero, Cómo funciona, Anti-trampas, Descarga y FAQ.
- **Descarga de la beta Android:** CTA directo al APK más reciente.
- **Tema claro/oscuro:** persistente en `localStorage` y sin parpadeo al cargar.
- **UX cuidada:** reveal on scroll, progreso de lectura, spotlight y efectos de
  cursor solo en dispositivos con puntero fino.
- **Accesibilidad:** navegación por teclado, skip link, `aria-label`s y respeto
  a `prefers-reduced-motion`.
- **SEO:** Open Graph/Twitter, datos estructurados `SoftwareApplication`,
  `robots.txt`, `sitemap.xml` y favicon.
- **Responsive:** composición adaptada de móvil a escritorio.

Este repositorio contiene únicamente el sitio público. La app móvil, el backend
y la infraestructura de despliegue viven en espacios separados.

## Stack

| Capa          | Tecnología                                            |
| ------------- | ----------------------------------------------------- |
| Framework     | Astro 7 (salida estática)                             |
| Lenguaje      | TypeScript 6 en modo estricto                         |
| Estilos       | Tailwind CSS v4 + design tokens en `global.css`       |
| Tipografías   | Inter, Space Grotesk y JetBrains Mono (auto-hosteada) |
| Interactividad| Scripts nativos del navegador, sin framework de UI    |

## Requisitos

- Node.js 20 o superior
- npm

## Desarrollo

```sh
git clone https://github.com/Crisls24/rivalfit-site.git
cd rivalfit-site
npm install
npm run dev
```

El servidor de desarrollo queda disponible en <http://localhost:4321>.

| Comando           | Qué hace                                    |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en vivo  |
| `npm run build`   | Genera el sitio estático en `dist/`         |
| `npm run preview` | Sirve `dist/` localmente                    |
| `npm run check`   | Type-check y diagnósticos de Astro          |

Antes de dar por terminado un cambio, ejecuta `npm run check` y `npm run build`.

## Estructura

```text
.
├── astro.config.mjs          # Dominio base y plugin de Tailwind
├── public/
│   ├── apk/                  # Contrato de descarga + APK local (no versionado)
│   ├── assets/videos/        # Clips de demostración y poster
│   ├── favicon.svg
│   ├── og.png                # Imagen social 1200×630
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   ├── gen-og.mjs            # Regenera public/og.png
│   └── gen-poster.ps1        # Extrae el poster desde un clip
└── src/
    ├── components/           # Hero, HowItWorks, AntiCheat, Download, Faq, Nav, Footer, Logo
    ├── layouts/
    │   └── Layout.astro      # Head SEO/OG, JSON-LD, tema, scripts globales
    ├── lib/
    │   └── site.ts           # Nombre, URL, descripción, navegación y rutas del APK
    ├── pages/
    │   └── index.astro       # Composición de la página
    ├── scripts/
    │   └── ux.ts             # Reveal, scroll, cursor y animaciones
    └── styles/
        └── global.css        # Tokens del brand kit, tema oscuro y utilidades
```

Puntos de edición:

- **Datos globales:** `src/lib/site.ts` es la fuente única para nombre, dominio,
  descripción, navegación y rutas del APK.
- **Contenido de secciones:** los textos y arrays viven en su componente
  correspondiente; no se duplican entre archivos.
- **Metadatos:** `src/layouts/Layout.astro` centraliza SEO, Open Graph y JSON-LD.
- **Dominio:** si cambia, actualiza también `astro.config.mjs`, `public/robots.txt`
  y `public/sitemap.xml`.

## Descarga del APK

El botón de descarga apunta directamente a `/apk/rivalfit-latest.apk`. Hoy el
sitio **no** consulta `SHA256SUMS` ni muestra el hash en pantalla: el enlace está
siempre activo y devolverá 404 si el archivo no está presente en el despliegue.

El APK firmado y los checksums **no se versionan** (ver `.gitignore`). Un clon
nuevo no incluye un APK descargable; para probar la descarga en local, copia el
release antes de arrancar el servidor o hacer el build.

Publicar una nueva beta:

```powershell
# 1. Copia el APK firmado
Copy-Item .\build\app\outputs\flutter-apk\app-release.apk .\public\apk\rivalfit-latest.apk

# 2. Opcional: conserva una copia versionada
Copy-Item .\public\apk\rivalfit-latest.apk .\public\apk\rivalfit-1.0.0.apk

# 3. Genera checksums para verificación manual
Get-FileHash .\public\apk\rivalfit-*.apk -Algorithm SHA256 |
  ForEach-Object { "$($_.Hash.ToLower())  $(Split-Path $_.Path -Leaf)" } |
  Set-Content .\public\apk\SHA256SUMS -Encoding ascii
```

En Linux/CI:

```bash
cd public/apk
sha256sum rivalfit-*.apk > SHA256SUMS
```

El contrato completo de la carpeta está en `public/apk/README.md`.

## Assets

- **Vídeos:** clips de stock en `public/assets/videos/` (licencia Coverr, sin
  atribución requerida).
- **Poster:** `workout-demo-poster.jpg` es un frame real de uno de los clips; se
  regenera con `scripts/gen-poster.ps1`.
- **OG image:** se regenera con `node scripts/gen-og.mjs`.
- La carpeta local `/Videos/` contiene copias de trabajo y está ignorada por Git.

## Despliegue

`npm run build` genera `dist/`, que se publica como sitio estático detrás de
nginx. La configuración del servidor, el túnel y las credenciales se gestionan
fuera de este repositorio.

El servidor debe:

- Servir `dist/` como raíz del dominio configurado.
- Incluir `public/apk/rivalfit-latest.apk` en el despliegue.
- Entregar los `.apk` con `Content-Type: application/vnd.android.package-archive`.
- Permitir descargas de archivos grandes (el APK supera los 200 MB).

## Seguridad

- **Nunca** versionar `.env`, tokens, claves de API, `service_role`, credenciales
  del túnel, keystores (`*.jks`) ni `key.properties`.
- El APK firmado y `SHA256SUMS` tampoco se suben al repositorio.
- El sitio es estático y no expone claves en el HTML ni en el JavaScript.
- La firma del APK y la infraestructura se manejan en entornos privados.
- Si se agregan formularios, analítica o servicios externos, usa variables de
  entorno y solo claves públicas diseñadas para el cliente.

## Documentación interna

El PRD y el registro de infraestructura se mantienen fuera del repositorio
público. No copies secretos, hosts internos ni credenciales en la documentación
versionada.

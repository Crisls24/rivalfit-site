// ═══ RIVALFIT — Verificación del release para descargar ═══
// Lee public/apk/SHA256SUMS, muestra el SHA-256 verificado junto al CTA y,
// si no existe el release, deja el botón en estado "próximamente".

const cta = document.getElementById("apk-cta");
const meta = document.getElementById("apk-meta");

if (cta && meta) {
  meta.textContent = "Verificando release…";
  fetch("/apk/SHA256SUMS")
    .then((res) => (res.ok ? res.text() : Promise.reject(new Error("sin release"))))
    .then((text) => {
      const entry = text
        .split(/\r?\n/)
        .find((line) => line.includes("rivalfit-latest.apk"));
      const hash = entry?.trim().split(/\s+/)[0];
      if (!hash) throw new Error("hash no encontrado");
      meta.textContent = `SHA-256  ${hash}`;
    })
    .catch(() => {
      cta.setAttribute("href", "#descargar");
      cta.setAttribute("aria-disabled", "true");
      cta.classList.add("pointer-events-none", "opacity-60", "saturate-50");
      meta.textContent = "Próximamente — se confirmará la firma al publicar el release.";
    });
}
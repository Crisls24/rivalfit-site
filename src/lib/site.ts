export const SITE = {
  name: "RivalFit",
  tagline: "Entrena con tus amigos y compite por el primer lugar.",
  url: "https://rivalfit.iscx.site",
  lang: "es",
  locale: "es-MX",
  description:
    "RivalFit convierte el entrenamiento en una competencia real con tus amigos. Crea tu liga, mide tu progreso y compite semana a semana.",
} as const;

export const APP = {
  version: "1.0.0",
  androidMin: "Android 10+",
  apkFilename: "rivalfit-1.0.0.apk",
  apkLatestPath: "/apk/rivalfit-latest.apk",
  apkVersionedPath: "/apk/rivalfit-1.0.0.apk",
  sha256File: "/apk/SHA256SUMS",
} as const;

export const CONTACT = {
  email: "hola@rivalfit.iscx.site",
  emailHref: "mailto:hola@rivalfit.iscx.site",
} as const;

export const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#liga", label: "Liga" },
  { href: "#anti-trampas", label: "Anti-trampas" },
  { href: "#descargar", label: "Descargar" },
  { href: "#faq", label: "FAQ" },
] as const;
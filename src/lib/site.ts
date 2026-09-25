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
  androidMin: "Android 10+",
  apkLatestPath: "/apk/rivalfit-latest.apk",
  apkVersionedPath: "/apk/rivalfit-1.0.0.apk",
} as const;

export const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#anti-trampas", label: "Anti-trampas" },
  { href: "#descargar", label: "Descargar" },
  { href: "#faq", label: "FAQ" },
] as const;
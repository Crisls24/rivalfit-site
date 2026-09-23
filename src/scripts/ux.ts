// ═══ RIVALFIT — UX interactiva ═══
// Guardián de moto reducida y pointer fino (solo desktop para efectos de cursor).

const reduceMotion =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

const finePointer =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(pointer: fine)").matches ?? true);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function initScrollGlobals() {
  const progressBar = document.getElementById("scroll-progress");
  const header = document.getElementById("site-header");
  const backTop = document.getElementById("back-to-top");

  let ticking = false;
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY;

    if (progressBar) {
      progressBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    }
    if (header) header.toggleAttribute("data-scrolled", y > 8);
    if (backTop) backTop.toggleAttribute("data-hidden", y < 600);

    ticking = false;
  };
  const request = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  };

  window.addEventListener("scroll", request, { passive: true });
  onScroll();
}

function initCursorGlow() {
  if (!finePointer || reduceMotion) return;

  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let cx = tx;
  let cy = ty;
  let visible = false;

  const onMove = (e: PointerEvent) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!visible) {
      visible = true;
      glow.style.opacity = "1";
    }
  };
  const onLeave = () => {
    visible = false;
    glow.style.opacity = "0";
  };

  const tick = () => {
    cx = lerp(cx, tx, 0.13);
    cy = lerp(cy, ty, 0.13);
    glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    window.requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.requestAnimationFrame(tick);
}

function initSpotlightCards() {
  if (!finePointer || reduceMotion) return;

  document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const { left, top, width, height } = rect;
        card.style.setProperty("--mx", `${((e.clientX - left) / width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - top) / height) * 100}%`);
      },
      { passive: true },
    );
  });
}

function initMagnetButtons() {
  if (!finePointer || reduceMotion) return;

  document.querySelectorAll("[data-magnet]").forEach((el) => {
    const target = el as HTMLElement;
    target.addEventListener(
      "pointermove",
      (e) => {
        const rect = target.getBoundingClientRect();
        const dx = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 6;
        const dy = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 6;
        target.style.transform = `translate(${dx}px, calc(-2px + ${dy}px))`;
      },
      { passive: true },
    );
    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });
}

function initDrawOnView() {
  const targets = document.querySelectorAll("[data-draw]");
  if (!targets.length) return;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-rf-drawn");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 },
    );
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add("is-rf-drawn"));
  }
}

function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("is-visible"));
  }
}

initScrollGlobals();
initReveal();
initCursorGlow();
initSpotlightCards();
initMagnetButtons();
initDrawOnView();
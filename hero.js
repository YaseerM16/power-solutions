// npm i gsap  (same package as the services section)
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(gsap.ScrollTrigger);

export function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Project switcher ---------- */
  const slides = [...hero.querySelectorAll(".hc__slide")];
  const tabs = [...hero.querySelectorAll(".hc__tabs button")];
  const card = hero.querySelector(".hc");
  const DURATION = 6;
  let index = 0, timer;

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
    tabs.forEach((t, n) => {
      t.setAttribute("aria-selected", n === index);
      t.tabIndex = n === index ? 0 : -1;
    });
    timer?.kill();
    gsap.set(tabs.map((t) => t.querySelector("i")), { scaleX: 0 });
    if (reduce) return;
    timer = gsap.fromTo(
      tabs[index].querySelector("i"),
      { scaleX: 0 },
      { scaleX: 1, duration: DURATION, ease: "none", onComplete: () => go(index + 1) }
    );
  }
  tabs.forEach((t, n) => t.addEventListener("click", () => go(n)));
  tabs.forEach((t) =>
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { go(index + 1); tabs[index].focus(); }
      if (e.key === "ArrowLeft") { go(index - 1); tabs[index].focus(); }
    })
  );
  card.addEventListener("pointerenter", () => timer?.pause());
  card.addEventListener("pointerleave", () => timer?.resume());
  go(0);

  if (reduce) return;

  /* ---------- One orchestrated load sequence ---------- */
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.from(".hero__trace path", { strokeDashoffset: 1, duration: 2.2, ease: "power2.inOut" }, 0)
    .from(".hero .eyebrow", { opacity: 0, x: -16, duration: 0.7 }, 0.15)
    .from(".hero h1 .line > *", { yPercent: 110, duration: 1.1, stagger: 0.14 }, 0.25)
    .from(".hero-text, .hero-actions, .hero-points", { opacity: 0, y: 18, duration: 0.8, stagger: 0.1 }, 0.8)
    .from(".hero .hc", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "power4.inOut", clearProps: "clipPath" }, 0.4);

  /* ---------- Background drifts slower than the page ---------- */
  gsap.to(".hero__bg", {
    yPercent: 8, ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
}

// npm i gsap
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(gsap.ScrollTrigger);

export function initServices() {
  const grid = document.querySelector(".svc-grid");
  if (!grid) return;
  const cards = gsap.utils.toArray(".svc");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pointer spotlight (desktop only)
  if (matchMedia("(hover: hover)").matches) {
    cards.forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }
  if (reduce) return;

  // One orchestrated moment: the grid "unveils" like a switchboard powering on.
  gsap.set(cards, { clipPath: "inset(0 0 100% 0)" });

  ScrollTrigger.create({
    trigger: grid,
    start: "top 80%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(cards, {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.1,
        stagger: { each: 0.07, from: "start" },
        onComplete: () => gsap.set(cards, { clearProps: "clipPath" }),
      });
    },
  });

  // Gentle depth: backgrounds drift slightly as you scroll past
  cards.forEach((card) => {
    gsap.fromTo(
      card.querySelector(".svc__bg"),
      { yPercent: -4 },
      {
        yPercent: 4, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });
}

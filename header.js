// Uses the same gsap package as the other sections (only for the load fade-in).

export function initHeader() {
  const header = document.querySelector(".site-header");
  console.log("THis is HEdader js")
  if (!header) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const burger = header.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  const progress = header.querySelector(".site-header__progress");
  const links = [...header.querySelectorAll("nav a")];

  /* Scroll state: transparent on top, frosted when scrolled,
     tucks away going down, returns going up, progress line fills. */
  let lastY = scrollY, ticking = false;
  function onScroll() {
    const y = scrollY;
    header.dataset.state = y > 40 ? "scrolled" : "top";
    const menuOpen = menu.classList.contains("is-open");
    if (!menuOpen) {
      if (y > lastY + 4 && y > 500) header.dataset.hidden = "true";
      else if (y < lastY - 4) header.dataset.hidden = "false";
    }
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Highlight the nav link for the section in view */
  const map = new Map(links.map((a) => [a.getAttribute("href"), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const link = map.get("#" + e.target.id);
      if (link && e.isIntersecting) {
        links.forEach((a) => a.classList.toggle("is-active", a === link));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["services", "about", "contact"].forEach((id) => { const s = document.getElementById(id); s && io.observe(s); });
  new IntersectionObserver(([e]) => { if (e.isIntersecting) links.forEach((a) => a.classList.remove("is-active")); })
    .observe(document.querySelector(".hero") || document.body);

  /* Mobile menu */
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    open ? menu.removeAttribute("inert") : menu.setAttribute("inert", "");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    header.dataset.hidden = "false";
    if (open) menu.querySelector("a")?.focus({ preventScroll: true });
    else burger.focus({ preventScroll: true });
  }
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false); });
  matchMedia("(min-width: 801px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

  if (!reduce) {
    gsap.from(".header-inner > *", { y: -14, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.1, clearProps: "all" });
  }

  document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".hc__tabs [role='tab']");
  const slides = document.querySelectorAll(".hc__slide");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item, i) => {
        const active = i === index;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });
    });
  });
});
}
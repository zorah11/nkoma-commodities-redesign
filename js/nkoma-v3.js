const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.textContent = open ? "Menu" : "Close";
  navigation?.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.1 },
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const photos = [...document.querySelectorAll("[data-parallax]")];
const hero = document.querySelector(".hero-visual");
let pending = false;
function updateMotion() {
  pending = false;
  const enabled = !reducedMotion.matches && window.innerWidth > 900;
  photos.forEach((photo) => {
    const section = photo.parentElement.getBoundingClientRect();
    const offset = enabled
      ? Math.max(
          -42,
          Math.min(
            42,
            (window.innerHeight / 2 - section.top - section.height / 2) *
              Number(photo.dataset.parallax),
          ),
        )
      : 0;
    photo.style.setProperty("--scroll-y", `${offset}px`);
  });
  if (hero) {
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty(
      "--hero-y",
      `${enabled ? Math.max(-28, Math.min(28, -bounds.top * 0.07)) : 0}px`,
    );
  }
}
function scheduleMotion() {
  if (!pending) {
    pending = true;
    requestAnimationFrame(updateMotion);
  }
}
window.addEventListener("scroll", scheduleMotion, { passive: true });
window.addEventListener("resize", scheduleMotion);
reducedMotion.addEventListener("change", scheduleMotion);
scheduleMotion();
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton?.getAttribute("aria-expanded") === "true"
  ) {
    menuButton.click();
    menuButton.focus();
  }
});

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

const field = document.querySelector(".bean-field");
if (field && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 22;
      const y = (event.clientY / window.innerHeight - 0.5) * 22;
      field.querySelectorAll(".bean").forEach((bean, index) => {
        const depth = (index + 1) * 0.34;
        bean.style.setProperty("--mx", `${x * depth}px`);
        bean.style.setProperty("--my", `${y * depth}px`);
      });
    },
    { passive: true },
  );
}

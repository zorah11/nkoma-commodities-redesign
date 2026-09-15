const menu = document.querySelector(".menu"),
  nav = document.querySelector(".nav");
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("open", !open);
});
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const tradeMenu = document.querySelector(".trade-menu");
const tradeNavigation = document.querySelector("#trade-navigation");

tradeMenu?.addEventListener("click", () => {
  const isOpen = tradeMenu.getAttribute("aria-expanded") === "true";
  tradeMenu.setAttribute("aria-expanded", String(!isOpen));
  tradeMenu.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
  tradeMenu.textContent = isOpen ? "Menu" : "Close";
  tradeNavigation?.classList.toggle("open", !isOpen);
});

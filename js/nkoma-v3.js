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
  const enabled = !reducedMotion.matches;
  const mobile = window.innerWidth <= 900;
  photos.forEach((photo) => {
    const section = photo.parentElement.getBoundingClientRect();
    const offset = enabled
      ? Math.max(
          mobile ? -20 : -90,
          Math.min(
            mobile ? 20 : 90,
            (window.innerHeight / 2 - section.top - section.height / 2) *
              Number(photo.dataset.parallax) *
              (mobile ? 0.8 : 2.4),
          ),
        )
      : 0;
    photo.style.setProperty("--scroll-y", `${offset}px`);
    photo.style.setProperty("--scroll-rotate", `${offset * 0.025}deg`);
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

// Each origin remains a real link; manual interaction stops automatic advance.
document.querySelectorAll(".origin-track").forEach((track) => {
  const cards = [...track.querySelectorAll(".origin-card")];
  const controls = document.createElement("div");
  controls.className = "origin-controls";
  controls.innerHTML =
    '<div class="origin-position" aria-live="off">01 / 05</div><div class="origin-buttons"><button type="button" class="origin-prev" aria-label="Previous coffee origin">←</button><button type="button" class="origin-play" aria-label="Pause automatic coffee carousel">Pause motion</button><button type="button" class="origin-next" aria-label="Next coffee origin">→</button></div>';
  track.after(controls);
  const hint = controls.parentElement.querySelector(".origin-hint");
  if (hint)
    hint.textContent = "Explore five Ugandan origins · swipe or use the arrows";
  const play = controls.querySelector(".origin-play");
  let paused = reducedMotion.matches,
    hovered = false,
    visible = false;
  const current = () =>
    cards.reduce(
      (best, card, i) =>
        Math.abs(card.offsetLeft - cards[0].offsetLeft - track.scrollLeft) <
        Math.abs(
          cards[best].offsetLeft - cards[0].offsetLeft - track.scrollLeft,
        )
          ? i
          : best,
      0,
    );
  function setPaused(value) {
    paused = value;
    play.textContent = paused ? "Play motion" : "Pause motion";
    play.setAttribute(
      "aria-label",
      paused
        ? "Start automatic coffee carousel"
        : "Pause automatic coffee carousel",
    );
  }
  function move(direction) {
    const max = track.scrollWidth - track.clientWidth;
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    let target = track.scrollLeft + direction * step;
    if (direction > 0 && track.scrollLeft >= max - 3) target = 0;
    if (direction < 0 && track.scrollLeft <= 3) target = max;
    track.scrollTo({
      left: Math.max(0, Math.min(max, target)),
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
  }
  controls.querySelector(".origin-prev").addEventListener("click", () => {
    setPaused(true);
    move(-1);
  });
  controls.querySelector(".origin-next").addEventListener("click", () => {
    setPaused(true);
    move(1);
  });
  play.addEventListener("click", () => setPaused(!paused));
  track.addEventListener("pointerenter", () => {
    hovered = true;
  });
  track.addEventListener("pointerleave", () => {
    hovered = false;
  });
  track.addEventListener("pointerdown", () => setPaused(true), {
    passive: true,
  });
  track.addEventListener("focusin", () => setPaused(true));
  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      setPaused(true);
      move(event.key === "ArrowRight" ? 1 : -1);
    }
  });
  track.addEventListener(
    "scroll",
    () => {
      controls.querySelector(".origin-position").textContent =
        `${String(current() + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    },
    { passive: true },
  );
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
    },
    { threshold: 0.35 },
  ).observe(track);
  setInterval(() => {
    if (
      visible &&
      !paused &&
      !hovered &&
      !document.hidden &&
      !reducedMotion.matches
    )
      move(1);
  }, 4600);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) setPaused(true);
  });
  setPaused(paused);
});

const entranceObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const figures = [...entry.target.querySelectorAll("figure")];
      if (!reducedMotion.matches)
        figures.forEach((figure, index) => {
          const animation = figure.querySelector("img").animate(
            [
              { clipPath: "inset(100% 0 0 0)", transform: "scale(1.16)" },
              { clipPath: "inset(0% 0 0 0)", transform: "scale(1)" },
            ],
            {
              duration: 1150,
              delay: index * 160,
              easing: "cubic-bezier(.16,1,.3,1)",
              fill: "backwards",
            },
          );
          reducedMotion.addEventListener(
            "change",
            () => {
              if (reducedMotion.matches) animation.finish();
            },
            { once: true },
          );
        });
      entranceObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".photo-ribbon")
  .forEach((el) => entranceObserver.observe(el));

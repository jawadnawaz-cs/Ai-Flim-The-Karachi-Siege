/* Reveal on scroll */
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.setProperty("--i", i % 6);
  io.observe(el);
});

/* Helper to activate a lazy YouTube player */
function activatePlayer(iframeId, posterId) {
  const iframe = document.getElementById(iframeId);
  const poster = document.getElementById(posterId);
  if (!iframe || !poster) return;
  if (iframe.classList.contains("is-playing")) return;

  const source = iframe.dataset.src;
  if (!source) return;
  iframe.src = source + (source.includes("?") ? "&" : "?") + "autoplay=1";
  poster.hidden = true;
  iframe.classList.add("is-playing");
}

const trailerPlay = document.getElementById("trailer-play");
if (trailerPlay) {
  trailerPlay.addEventListener("click", () => {
    activatePlayer("trailer", "trailer-play");
  });
}

const filmPlay = document.getElementById("film-play");
if (filmPlay) {
  filmPlay.addEventListener("click", () => {
    activatePlayer("film", "film-play");
  });
}

/* Hero CTA quick-play triggers */
document.querySelectorAll("[data-watch-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-watch-target");
    if (target === "trailer") {
      setTimeout(() => activatePlayer("trailer", "trailer-play"), 350);
    } else if (target === "movie") {
      setTimeout(() => activatePlayer("film", "film-play"), 350);
    }
  });
});

/* Screening Room nav tabs */
const screenTabs = document.querySelectorAll("[data-screen-nav]");
screenTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    screenTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
  });
});

/* Theater Mode toggle */
const theaterToggle = document.getElementById("theater-toggle");
if (theaterToggle) {
  theaterToggle.addEventListener("click", () => {
    const active = document.body.classList.toggle("theater-mode");
    theaterToggle.setAttribute("aria-pressed", String(active));
    theaterToggle.innerHTML = active
      ? '<span aria-hidden="true">☀</span> Exit Theater'
      : '<span aria-hidden="true">◐</span> Theater Mode';
  });
}

/* Cast faction filter */
const castFilterBtns = document.querySelectorAll("[data-cast-filter]");
const castCards = document.querySelectorAll("#cast-grid .cast-card");

castFilterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-cast-filter");
    castFilterBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    castCards.forEach((card) => {
      const match = filter === "all" || card.getAttribute("data-faction") === filter;
      card.hidden = !match;
    });
  });
});

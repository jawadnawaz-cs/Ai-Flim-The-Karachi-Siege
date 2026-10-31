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
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.setProperty("--i", i % 6);
  io.observe(el);
});

/* Load the film only when the real storyboard still is activated. */
const film = document.getElementById("film");
const filmPlay = document.getElementById("film-play");
if (film && filmPlay) {
  filmPlay.addEventListener("click", () => {
    const source = film.dataset.src;
    if (!source) return;
    film.src = source + (source.includes("?") ? "&" : "?") + "autoplay=1";
    filmPlay.hidden = true;
    film.classList.add("is-playing");
  }, { once: true });
}

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

/* Hide the video shimmer once the player has loaded */
const film = document.getElementById("film");
const videoPlaceholder = document.querySelector(".video-placeholder");
if (film && videoPlaceholder) {
  film.addEventListener("load", () => videoPlaceholder.classList.add("is-hidden"));
}
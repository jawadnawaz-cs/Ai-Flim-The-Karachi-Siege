const SCENE_COUNT = 80;
const grid = document.getElementById("stills-grid");
const dialog = document.getElementById("lightbox");
const bigImg = document.getElementById("lightbox-img");

function card(scene) {
  const num = String(scene).padStart(2, "0");
  const figure = document.createElement("figure");
  figure.className = "shot";

  const frame = document.createElement("div");
  frame.className = "shot-frame";
  frame.tabIndex = 0;

  const img = document.createElement("img");
  img.src = `stills/scene_${num}.webp`;
  img.alt = `Scene ${num} still`;
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("load", () => frame.classList.add("is-loaded"));
  img.addEventListener("error", () => {
    frame.classList.add("is-loaded");
    frame.dataset.missing = "true";
  });

  const open = () => {
    if (frame.dataset.missing) return;
    bigImg.src = img.src;
    bigImg.alt = img.alt;
    dialog.showModal();
  };
  frame.addEventListener("click", open);
  frame.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });

  const caption = document.createElement("figcaption");
  caption.textContent = `Scene ${num}`;

  frame.appendChild(img);
  figure.append(frame, caption);
  return figure;
}

for (let s = 1; s <= SCENE_COUNT; s++) grid.appendChild(card(s));
document.getElementById("stills-count").textContent = `${SCENE_COUNT} scenes`;

dialog.addEventListener("click", (e) => {
  if (e.target === dialog || e.target.classList.contains("lightbox-close")) dialog.close();
});
import { prompts } from "./prompts.js";

const SCENE_COUNT = 80;
const grid = document.getElementById("stills-grid");
const dialog = document.getElementById("lightbox");
const bigImg = document.getElementById("lightbox-img");
const countEl = document.getElementById("stills-count");
const searchInput = document.getElementById("scene-search");
const actBtns = document.querySelectorAll("#act-filters .filter-btn");

/* Build per-scene metadata from prompts.js */
const sceneMap = new Map();
for (let s = 1; s <= SCENE_COUNT; s++) {
  const clips = prompts.filter((p) => Number(p.scene) === s);
  const first = clips[0] || {};
  const uniqueChars = [
    ...new Set(
      clips
        .flatMap((c) => (c.characters || "").split(","))
        .map((ch) => ch.trim())
        .filter(Boolean)
    ),
  ].join(", ");

  const vo =
    clips.find((c) => c.voice_over && c.voice_over !== "Character Dialogue")?.voice_over ||
    first.voice_over ||
    "—";

  sceneMap.set(s, {
    scene: s,
    num: String(s).padStart(2, "0"),
    act: Math.ceil(s / 20),
    duration: first.duration || "—",
    place: first.place || `Karachi · Scene ${String(s).padStart(2, "0")}`,
    characters: uniqueChars || "Ensemble",
    voice_over: vo,
    clips,
  });
}

let activeAct = "all";
let searchQuery = "";
let currentScene = 1;

/* Check URL parameter ?act=1..4 */
const params = new URLSearchParams(window.location.search);
if (params.has("act") && ["1", "2", "3", "4"].includes(params.get("act"))) {
  activeAct = params.get("act");
  actBtns.forEach((b) => {
    b.classList.toggle("is-active", b.dataset.act === activeAct);
  });
}

function openLightbox(sceneNumber) {
  const data = sceneMap.get(sceneNumber);
  if (!data) return;
  currentScene = sceneNumber;

  bigImg.src = `stills/scene_${data.num}.webp`;
  bigImg.alt = `Scene ${data.num} — ${data.place}`;
  document.getElementById("lb-scene-num").textContent = `SCENE ${data.num} · ACT ${data.act}`;
  document.getElementById("lb-timecode").textContent = `TC ${data.duration}`;
  document.getElementById("lb-place").textContent = data.place;
  document.getElementById("lb-characters").textContent = data.characters;
  document.getElementById("lb-vo").textContent = data.voice_over;

  const clipsContainer = document.getElementById("lb-clips");
  clipsContainer.innerHTML = "";
  data.clips.forEach((clip) => {
    const item = document.createElement("div");
    item.className = "lb-clip-card";

    const head = document.createElement("div");
    head.className = "lb-clip-head";
    const titleSpan = document.createElement("strong");
    titleSpan.textContent = clip.title;
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "copy-btn lb-copy";
    copyBtn.textContent = "Copy prompt";
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(clip.body);
        copyBtn.textContent = "Copied ✓";
      } catch {
        copyBtn.textContent = "Copy failed";
      }
      setTimeout(() => (copyBtn.textContent = "Copy prompt"), 1500);
    });
    head.append(titleSpan, copyBtn);

    const bodyPre = document.createElement("p");
    bodyPre.className = "lb-clip-body";
    bodyPre.textContent = clip.body;

    item.append(head, bodyPre);
    clipsContainer.appendChild(item);
  });

  if (!dialog.open) dialog.showModal();
}

function card(sceneNumber) {
  const data = sceneMap.get(sceneNumber);
  const figure = document.createElement("figure");
  figure.className = "shot";
  figure.dataset.scene = String(sceneNumber);

  const frame = document.createElement("div");
  frame.className = "shot-frame";
  frame.tabIndex = 0;

  const badge = document.createElement("span");
  badge.className = "shot-badge";
  badge.textContent = `SCENE ${data.num}`;

  const tc = document.createElement("span");
  tc.className = "shot-tc";
  tc.textContent = data.duration;

  const img = document.createElement("img");
  img.src = `stills/scene_${data.num}.webp`;
  img.alt = `Scene ${data.num}: ${data.place}`;
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("load", () => frame.classList.add("is-loaded"));
  img.addEventListener("error", () => {
    frame.classList.add("is-loaded");
    frame.dataset.missing = "true";
  });

  const open = () => {
    if (frame.dataset.missing) return;
    openLightbox(sceneNumber);
  };
  frame.addEventListener("click", open);
  frame.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });

  const caption = document.createElement("figcaption");
  const titleRow = document.createElement("strong");
  titleRow.className = "shot-place";
  titleRow.textContent = data.place;
  const charRow = document.createElement("span");
  charRow.className = "shot-chars";
  charRow.textContent = data.characters;
  caption.append(titleRow, charRow);

  frame.append(badge, tc, img);
  figure.append(frame, caption);
  return figure;
}

function renderGrid() {
  grid.innerHTML = "";
  let visible = 0;
  const q = searchQuery.trim().toLowerCase();

  for (let s = 1; s <= SCENE_COUNT; s++) {
    const data = sceneMap.get(s);
    if (activeAct !== "all" && String(data.act) !== activeAct) continue;

    if (q) {
      const hay = `scene ${data.num} ${data.place} ${data.characters} ${data.voice_over}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }

    grid.appendChild(card(s));
    visible++;
  }

  countEl.textContent = `${visible} of ${SCENE_COUNT} scenes`;
}

actBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeAct = btn.dataset.act;
    actBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
    renderGrid();
  });
});

searchInput?.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderGrid();
});

document.getElementById("lb-prev")?.addEventListener("click", () => {
  const prev = currentScene > 1 ? currentScene - 1 : SCENE_COUNT;
  openLightbox(prev);
});

document.getElementById("lb-next")?.addEventListener("click", () => {
  const next = currentScene < SCENE_COUNT ? currentScene + 1 : 1;
  openLightbox(next);
});

window.addEventListener("keydown", (e) => {
  if (!dialog.open) return;
  if (e.key === "ArrowLeft") {
    openLightbox(currentScene > 1 ? currentScene - 1 : SCENE_COUNT);
  } else if (e.key === "ArrowRight") {
    openLightbox(currentScene < SCENE_COUNT ? currentScene + 1 : 1);
  }
});

dialog.addEventListener("click", (e) => {
  if (e.target === dialog || e.target.classList.contains("lightbox-close")) {
    dialog.close();
  }
});

renderGrid();
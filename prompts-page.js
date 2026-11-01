import { prompts } from "./prompts.js";

const list = document.getElementById("prompt-list");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("prompt-search");
const categories = ["All", ...new Set(prompts.map((p) => p.category))];
let active = "All";
let searchQuery = "";

document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));

function renderFilters() {
  filters.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn" + (cat === active ? " is-active" : "");
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", String(cat === active));
    btn.addEventListener("click", () => {
      active = cat;
      renderFilters();
      renderPrompts();
    });
    filters.appendChild(btn);
  });
}

function metaRow(label, value) {
  const row = document.createElement("div");
  row.className = "prompt-row";
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value || "—";
  row.append(dt, dd);
  return row;
}

function renderPrompts() {
  list.innerHTML = "";
  const q = searchQuery.trim().toLowerCase();

  const items = prompts.filter((p) => {
    if (active !== "All" && p.category !== active) return false;
    if (!q) return true;
    const hay = `${p.title} ${p.characters} ${p.place} ${p.voice_over} ${p.body}`.toLowerCase();
    return hay.includes(q);
  });

  items.forEach((p) => {
    const sceneNum = String(p.scene).padStart(2, "0");
    const card = document.createElement("article");
    card.className = "prompt-card";

    const topGrid = document.createElement("div");
    topGrid.className = "prompt-top-grid";

    const thumbWrap = document.createElement("a");
    thumbWrap.className = "prompt-thumb";
    thumbWrap.href = `storyboard.html?act=${Math.ceil(Number(p.scene) / 20)}`;
    thumbWrap.title = `View Scene ${sceneNum} in Storyboard`;
    const thumbImg = document.createElement("img");
    thumbImg.src = `stills/scene_${sceneNum}.webp`;
    thumbImg.alt = `Scene ${sceneNum} still`;
    thumbImg.loading = "lazy";
    const thumbBadge = document.createElement("span");
    thumbBadge.textContent = `SCENE ${sceneNum}`;
    thumbWrap.append(thumbImg, thumbBadge);

    const metaCol = document.createElement("div");
    metaCol.className = "prompt-meta-col";

    const head = document.createElement("header");
    head.className = "prompt-meta";
    head.innerHTML = `<span class="prompt-cat"></span><h3></h3>`;
    head.querySelector(".prompt-cat").textContent = p.category;
    head.querySelector("h3").textContent = p.title;

    const details = document.createElement("dl");
    details.className = "prompt-details";
    details.append(
      metaRow("Tool", p.tool),
      metaRow("Timecode", p.duration),
      metaRow("Characters", p.characters),
      metaRow("Location", p.place),
      metaRow("Voice-over", p.voice_over)
    );

    metaCol.append(head, details);
    topGrid.append(thumbWrap, metaCol);

    const body = document.createElement("pre");
    body.className = "prompt-body";
    body.textContent = p.body;

    const footerRow = document.createElement("div");
    footerRow.className = "prompt-card-footer";

    const clipTag = document.createElement("span");
    clipTag.className = "prompt-clip-id";
    clipTag.textContent = `CLIP ID: ${p.id} · 35MM ANAMORPHIC`;

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-btn";
    copy.textContent = "Copy prompt";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(p.body);
        copy.textContent = "Copied ✓";
      } catch {
        copy.textContent = "Copy failed";
      }
      setTimeout(() => (copy.textContent = "Copy prompt"), 1600);
    });

    footerRow.append(clipTag, copy);
    card.append(topGrid, body, footerRow);
    list.appendChild(card);
  });

  document.getElementById("prompt-count").textContent = `${items.length} of ${prompts.length} prompts`;
}

searchInput?.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderPrompts();
});

renderFilters();
renderPrompts();
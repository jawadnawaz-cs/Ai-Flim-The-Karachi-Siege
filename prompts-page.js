import { prompts } from "./prompts.js";

const list = document.getElementById("prompt-list");
const filters = document.getElementById("filters");
const categories = ["All", ...new Set(prompts.map((p) => p.category))];
let active = "All";

// Make sure every heading and block is visible straight away
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
  const items = active === "All" ? prompts : prompts.filter((p) => p.category === active);

  items.forEach((p) => {
    const card = document.createElement("article");
    card.className = "prompt-card";

    const head = document.createElement("header");
    head.className = "prompt-meta";
    head.innerHTML = `<span class="prompt-cat"></span><h3></h3>`;
    head.querySelector(".prompt-cat").textContent = p.category;
    head.querySelector("h3").textContent = p.title;

    const details = document.createElement("dl");
    details.className = "prompt-details";
    details.append(
      metaRow("Tool", p.tool),
      metaRow("Duration", p.duration),
      metaRow("Characters", p.characters),
      metaRow("Place", p.place),
      metaRow("Voice-over", p.voice_over)
    );

    const body = document.createElement("pre");
    body.className = "prompt-body";
    body.textContent = p.body;

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-btn";
    copy.textContent = "Copy prompt";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(p.body);
        copy.textContent = "Copied";
      } catch {
        copy.textContent = "Copy failed";
      }
      setTimeout(() => (copy.textContent = "Copy prompt"), 1600);
    });

    card.append(head, details, body, copy);
    list.appendChild(card);
  });

  document.getElementById("prompt-count").textContent = `${items.length} prompts`;
}

renderFilters();
renderPrompts();
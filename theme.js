const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const icon = document.querySelector(".theme-toggle-icon");
const label = document.querySelector(".theme-toggle-label");

let savedTheme = "dark";
try {
  savedTheme = localStorage.getItem("karachi-siege-theme") || "dark";
} catch {
  savedTheme = "dark";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  root.dataset.theme = isDark ? "dark" : "light";
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
  if (icon) icon.textContent = isDark ? "☀" : "☾";
  if (label) label.textContent = isDark ? "Light mode" : "Dark mode";
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", isDark ? "#0d0c0b" : "#f6f2ea");
}

applyTheme(savedTheme);
toggle?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("karachi-siege-theme", next);
  } catch {
    // Theme still works for this page if storage is unavailable.
  }
});

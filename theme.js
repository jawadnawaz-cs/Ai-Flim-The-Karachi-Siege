const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const icon = document.querySelector(".theme-toggle-icon");
const label = document.querySelector(".theme-toggle-label");
const STORAGE_KEY = "karachi-siege-theme-v2";

let savedTheme = "dark";
try {
  localStorage.removeItem("karachi-siege-theme");
  const stored = localStorage.getItem(STORAGE_KEY);
  savedTheme = stored === "light" ? "light" : "dark";
} catch {
  savedTheme = "dark";
}

function applyTheme(theme) {
  const isDark = theme !== "light";
  root.dataset.theme = isDark ? "dark" : "light";
  document.body?.classList.toggle("dark-mode", isDark);
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
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Theme still works for this page if storage is unavailable.
  }
});

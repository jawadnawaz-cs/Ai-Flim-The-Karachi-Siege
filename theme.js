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

// 3-Line Mobile Menu Drawer Controller (works across all pages)
const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
const navDrawer = document.getElementById("primary-nav-drawer");
const navBackdrop = document.getElementById("mobile-nav-backdrop");
const siteHeader = document.getElementById("site-header") || document.querySelector(".site-header");

function setMobileMenuOpen(open) {
  const isOpen = Boolean(open);
  siteHeader?.classList.toggle("menu-open", isOpen);
  document.body.classList.toggle("mobile-nav-locked", isOpen);
  if (mobileMenuBtn) {
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenuBtn.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  }
  if (navBackdrop) {
    navBackdrop.hidden = !isOpen;
  }
}

mobileMenuBtn?.addEventListener("click", () => {
  const currentlyOpen = siteHeader?.classList.contains("menu-open");
  setMobileMenuOpen(!currentlyOpen);
});

navBackdrop?.addEventListener("click", () => {
  setMobileMenuOpen(false);
});

navDrawer?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMobileMenuOpen(false);
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && siteHeader?.classList.contains("menu-open")) {
    setMobileMenuOpen(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860 && siteHeader?.classList.contains("menu-open")) {
    setMobileMenuOpen(false);
  }
});

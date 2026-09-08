const masthead = document.querySelector(".hero-masthead");
const menuToggle = masthead?.querySelector(".hero-menu-toggle");
const menuLinks = masthead?.querySelectorAll(".hero-masthead-link") || [];

function closeMastheadMenu() {
  if (!masthead || !menuToggle) return;
  masthead.classList.remove("is-menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "메뉴 열기");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = masthead.classList.toggle("is-menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

menuLinks.forEach((link) => link.addEventListener("click", closeMastheadMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMastheadMenu();
});

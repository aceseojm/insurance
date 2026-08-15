const guides = window.guideLibrary || [];
const guideMonths = document.querySelector("#topic-guide-months");

let activeGuideId = guides[0]?.id;

function renderGuideParagraphs(lines = []) {
  return lines.map((line) => `<p>${line}</p>`).join("");
}

function renderGuide(guideId) {
  const entry = guides.find((item) => item.id === guideId) || guides[0];

  if (!entry) {
    return;
  }

  activeGuideId = entry.id;

  document.querySelector("#topic-guide-category").textContent = entry.category;
  document.querySelector("#topic-guide-date").textContent = entry.dateLabel;
  document.querySelector("#topic-guide-title").textContent = entry.title;
  document.querySelector("#topic-guide-subtitle").textContent = entry.subtitle;
  document.querySelector("#topic-guide-summary").textContent = entry.summary;
  document.querySelector("#topic-guide-audience").innerHTML = renderGuideParagraphs(entry.audience);
  document.querySelector("#topic-guide-points").innerHTML = renderGuideParagraphs(entry.points);
  document.querySelector("#topic-guide-highlights").innerHTML = entry.highlights
    .map((line) => `<li>${line}</li>`)
    .join("");

  const cta = document.querySelector("#topic-guide-cta");
  cta.href = entry.href;
  cta.textContent = entry.ctaLabel;

  document.querySelectorAll(".whitepaper-month").forEach((link) => {
    const isActive = link.dataset.guideId === entry.id;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function renderGuideMonths() {
  if (!guideMonths) {
    return;
  }

  guideMonths.innerHTML = guides
    .map(
      (entry) => `
        <a
          class="whitepaper-month${entry.id === activeGuideId ? " is-active" : ""}"
          href="${entry.href}"
          target="_blank"
          rel="noopener noreferrer"
          role="tab"
          aria-selected="${entry.id === activeGuideId ? "true" : "false"}"
          data-guide-id="${entry.id}"
        >
          <strong>${entry.label}</strong>
          <p>${entry.context}</p>
        </a>
      `,
    )
    .join("");

  document.querySelectorAll(".whitepaper-month").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      renderGuide(link.dataset.guideId);
    });

    link.addEventListener("focus", () => {
      renderGuide(link.dataset.guideId);
    });

    link.addEventListener("click", () => {
      renderGuide(link.dataset.guideId);
    });
  });
}

renderGuideMonths();
renderGuide(activeGuideId);

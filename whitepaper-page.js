const whitepapers = window.whitepaperLibrary || [];
const whitepaperMonths = document.querySelector("#whitepaper-months");

let activeWhitepaperId = whitepapers[0]?.id;

function upsertMeta(selector, attribute, value) {
  const element = document.querySelector(selector);

  if (!element || !value) {
    return;
  }

  element.setAttribute(attribute, value);
}

function setWhitepaperStructuredData(entry) {
  const script = document.querySelector("#whitepaper-structured-data");

  if (!script || !entry) {
    return;
  }

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    alternativeHeadline: entry.subtitle,
    description: entry.summary,
    datePublished: entry.publishedAt,
    dateModified: entry.publishedAt,
    inLanguage: "ko",
    mainEntityOfPage: "https://kimwonja.com/whitepaper.html",
    image: ["https://kimwonja.com/back.png"],
    author: {
      "@type": "Person",
      name: "김원자",
      jobTitle: "Financial Planner",
    },
    publisher: {
      "@type": "Organization",
      name: "김원자 전문 FP",
      logo: {
        "@type": "ImageObject",
        url: "https://kimwonja.com/back.png",
      },
    },
    articleSection: entry.category,
    keywords: [entry.category, entry.subtitle, "보험", "생명보험", "보험 점검"],
  };

  script.textContent = JSON.stringify(articleData, null, 2);
}

function renderParagraphGroup(lines = []) {
  return lines.map((line) => `<p>${line}</p>`).join("");
}

function renderWhitepaper(whitepaperId) {
  const entry = whitepapers.find((item) => item.id === whitepaperId) || whitepapers[0];
  if (!entry) {
    return;
  }

  activeWhitepaperId = entry.id;

  document.querySelector("#whitepaper-category").textContent = entry.category;
  document.querySelector("#whitepaper-date").textContent = entry.monthLabel;
  document.querySelector("#whitepaper-title").textContent = entry.title;
  document.querySelector("#whitepaper-subtitle").textContent = entry.subtitle;
  document.querySelector("#whitepaper-summary").textContent = entry.summary;
  document.querySelector("#whitepaper-need").innerHTML = `<div class="whitepaper-richtext">${renderParagraphGroup(entry.need)}</div>`;
  document.querySelector("#whitepaper-definition").innerHTML = `<div class="whitepaper-richtext">${renderParagraphGroup(entry.definition)}</div>`;
  document.querySelector("#whitepaper-quote").innerHTML = renderParagraphGroup(entry.quote);
  document.querySelector("#whitepaper-consult").textContent = entry.consult;
  document.querySelector("#whitepaper-disclaimer").textContent = entry.disclaimer;

  document.querySelector("#surgery-class-grid").innerHTML = entry.classes
    .map(
      (item) => `
        <article class="surgery-class-card">
          <strong>${item.label}</strong>
          <p><b>${item.feature}</b></p>
          <p>${item.description}</p>
        </article>
      `,
    )
    .join("");

  document.querySelector("#whitepaper-check-grid").innerHTML = entry.checks
    .map(
      (item, index) => `
        <article class="whitepaper-check-item">
          <strong>${index + 1}. ${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `,
    )
    .join("");

  document.title = `${entry.subtitle} | 생명보험 활용백서 | 김원자 설계사`;
  upsertMeta('meta[name="description"]', "content", entry.summary);
  upsertMeta('link[rel="canonical"]', "href", "https://kimwonja.com/whitepaper.html");
  upsertMeta('meta[property="og:title"]', "content", `${entry.subtitle} | 생명보험 활용백서`);
  upsertMeta('meta[property="og:description"]', "content", entry.summary);
  upsertMeta('meta[property="og:url"]', "content", "https://kimwonja.com/whitepaper.html");
  upsertMeta('meta[property="og:image"]', "content", "https://kimwonja.com/back.png");
  upsertMeta('meta[name="twitter:title"]', "content", `${entry.subtitle} | 생명보험 활용백서`);
  upsertMeta('meta[name="twitter:description"]', "content", entry.summary);
  upsertMeta('meta[name="twitter:image"]', "content", "https://kimwonja.com/back.png");
  setWhitepaperStructuredData(entry);

  document.querySelectorAll(".whitepaper-month").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.whitepaperId === entry.id);
    button.setAttribute(
      "aria-selected",
      button.dataset.whitepaperId === entry.id ? "true" : "false",
    );
  });
}

function renderWhitepaperMonths() {
  if (!whitepaperMonths) {
    return;
  }

  whitepaperMonths.innerHTML = whitepapers
    .map(
      (entry) => `
        <button
          class="whitepaper-month${entry.id === activeWhitepaperId ? " is-active" : ""}"
          type="button"
          role="tab"
          aria-selected="${entry.id === activeWhitepaperId ? "true" : "false"}"
          data-whitepaper-id="${entry.id}"
        >
          ${entry.monthLabel}
          <small>${entry.subtitle}</small>
        </button>
      `,
    )
    .join("");

  document.querySelectorAll(".whitepaper-month").forEach((button) => {
    button.addEventListener("click", () => {
      renderWhitepaper(button.dataset.whitepaperId);
    });
  });
}

renderWhitepaperMonths();
renderWhitepaper(activeWhitepaperId);

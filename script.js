const state = {
  step: 1,
  toastTimer: null,
};

const funnelStoreKey = "insurance-funnel-leads";
const happyRichStoreKey = "happy-rich-subscribers";

const form = document.querySelector("#consultation-form");
const happyRichForm = document.querySelector("#happy-rich-form");
const painResultButton = document.querySelector(".pain-result-button");
const painResultMessage = document.querySelector("#pain-result-message");
const panels = [...document.querySelectorAll(".form-panel")];
const progressSteps = [...document.querySelectorAll(".progress-step")];
const toast = document.querySelector("#toast");
const whitepapers = window.whitepaperLibrary || [];

function trackEvent(name, detail = {}) {
  const payload = {
    name,
    detail,
    timestamp: new Date().toISOString(),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  console.info("[funnel-event]", payload);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");

  if (state.toastTimer) {
    window.clearTimeout(state.toastTimer);
  }

  state.toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function updateStep(nextStep) {
  state.step = nextStep;

  panels.forEach((panel) => {
    const panelStep = Number(panel.dataset.step);
    panel.classList.toggle("is-active", panelStep === nextStep);
  });

  progressSteps.forEach((step, index) => {
    step.classList.toggle("is-active", index + 1 === nextStep);
  });
}

function validateStep(step) {
  const panel = panels.find((item) => Number(item.dataset.step) === step);
  if (!panel) {
    return true;
  }

  const fields = [...panel.querySelectorAll("input, select, textarea")];

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  return true;
}

function saveLead(formData) {
  const leads = JSON.parse(window.localStorage.getItem(funnelStoreKey) || "[]");

  leads.push({
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    ...formData,
  });

  window.localStorage.setItem(funnelStoreKey, JSON.stringify(leads));
}

function saveHappyRichSubscriber(formData) {
  const subscribers = JSON.parse(window.localStorage.getItem(happyRichStoreKey) || "[]");

  subscribers.push({
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    ...formData,
  });

  window.localStorage.setItem(happyRichStoreKey, JSON.stringify(subscribers));
}

function renderWhitepaperTeaser() {
  const teaserCategory = document.querySelector("#whitepaper-teaser-category");
  const teaserDate = document.querySelector("#whitepaper-teaser-date");
  const teaserTitle = document.querySelector("#whitepaper-teaser-title");
  const teaserSubtitle = document.querySelector("#whitepaper-teaser-subtitle");
  const teaserPoints = document.querySelector("#whitepaper-teaser-points");
  const latest = whitepapers[0];

  if (!latest) {
    return;
  }

  if (teaserCategory) {
    teaserCategory.textContent = latest.category;
  }

  if (teaserDate) {
    teaserDate.textContent = latest.monthLabel;
  }

  if (teaserTitle) {
    teaserTitle.textContent = latest.title;
  }

  if (teaserSubtitle) {
    teaserSubtitle.textContent = latest.subtitle;
  }

  if (teaserPoints) {
    teaserPoints.innerHTML = (latest.teaserPoints || [])
      .map((point) => `<li>${point}</li>`)
      .join("");
  }
}

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const selector = button.getAttribute("data-scroll-target");
    const target = document.querySelector(selector);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      trackEvent("cta_click", { target: selector, label: button.textContent.trim() });
    }
  });
});

document.querySelectorAll('.pain-option input[type="checkbox"]').forEach((input) => {
  input.addEventListener("change", () => {
    trackEvent("pain_point_toggled", {
      value: input.value,
      checked: input.checked,
    });
  });
});

painResultButton?.addEventListener("click", () => {
  if (!painResultMessage) {
    return;
  }

  painResultMessage.hidden = false;
  painResultMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  trackEvent("pain_result_revealed", { label: painResultButton.textContent.trim() });
});

renderWhitepaperTeaser();

document.querySelector(".form-next")?.addEventListener("click", () => {
  if (!validateStep(1)) {
    return;
  }

  updateStep(2);
  trackEvent("funnel_step_advanced", { step: 2 });
});

document.querySelector(".form-prev")?.addEventListener("click", () => {
  updateStep(1);
  trackEvent("funnel_step_back", { step: 1 });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateStep(2)) {
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  saveLead(data);
  trackEvent("lead_submitted", { interest: data.interest, ageGroup: data.ageGroup });

  form.reset();
  updateStep(1);
  showToast("상담 신청이 접수되었습니다. 확인 후 연락드릴 예정입니다.");
});

happyRichForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [...happyRichForm.querySelectorAll("input")];

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return;
    }
  }

  const data = Object.fromEntries(new FormData(happyRichForm).entries());
  saveHappyRichSubscriber(data);
  trackEvent("happy_rich_submitted", { cityAddress: data.address });

  happyRichForm.reset();
  showToast("행복한 부자 신청이 접수되었습니다. 매월 유용한 정보를 보내드릴게요.");
});

trackEvent("page_view", { page: "insurance-funnel-landing" });

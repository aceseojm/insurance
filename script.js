const state = {
  step: 1,
  toastTimer: null,
  submitting: {
    consultation: false,
    happyRich: false,
  },
};

const funnelStoreKey = "insurance-funnel-leads";
const happyRichStoreKey = "happy-rich-subscribers";
const config = window.INSURANCE_CONFIG || {};

const form = document.querySelector("#consultation-form");
const happyRichForm = document.querySelector("#happy-rich-form");
const kakaoConsultLink = document.querySelector("#kakao-consult-link");
const painResultButton = document.querySelector(".pain-result-button");
const painResultMessage = document.querySelector("#pain-result-message");
const panels = [...document.querySelectorAll(".form-panel")];
const progressSteps = [...document.querySelectorAll(".progress-step")];
const toast = document.querySelector("#toast");
const whitepapers = window.whitepaperLibrary || [];

function getSourcePage() {
  const pageLabel = config.sourcePageLabel || "insurance-landing";
  const pathName = window.location.pathname || "/index.html";
  const normalizedPath = pathName.startsWith("/") ? pathName : `/${pathName}`;

  if (config.siteBaseUrl) {
    try {
      return new URL(normalizedPath, config.siteBaseUrl).toString();
    } catch (error) {
      console.warn("invalid siteBaseUrl in INSURANCE_CONFIG", error);
    }
  }

  if (window.location.protocol === "file:") {
    return `local:${pageLabel}`;
  }

  return window.location.href;
}

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

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add("is-visible");

  if (state.toastTimer) {
    window.clearTimeout(state.toastTimer);
  }

  state.toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, type === "error" ? 3600 : 3200);
}

function setSubmitButtonState(formElement, isSubmitting, pendingLabel) {
  const submitButton = formElement?.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  if (!submitButton.dataset.idleLabel) {
    submitButton.dataset.idleLabel = submitButton.textContent.trim();
  }

  submitButton.disabled = isSubmitting;
  submitButton.classList.toggle("is-submitting", isSubmitting);
  submitButton.textContent = isSubmitting ? pendingLabel : submitButton.dataset.idleLabel;
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

async function postToGoogleSheet(payload) {
  if (!config.googleSheetWebhookUrl) {
    return { ok: false, skipped: true };
  }

  const body = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    body.append(key, value ?? "");
  });

  const response = await fetch(config.googleSheetWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`sheet webhook failed: ${response.status}`);
  }

  return response.json();
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

if (kakaoConsultLink) {
  if (config.kakaoChatUrl) {
    kakaoConsultLink.href = config.kakaoChatUrl;
  } else {
    kakaoConsultLink.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("카카오톡 채널 또는 오픈채팅 링크를 넣으면 바로 연결됩니다.");
    });
  }
}

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

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (state.submitting.consultation) {
    return;
  }

  if (!validateStep(2)) {
    return;
  }

  state.submitting.consultation = true;
  setSubmitButtonState(form, true, "신청 접수 중...");

  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    ...data,
    privacy: data.privacy ? "동의" : "",
    submittedAt: new Date().toISOString(),
    sourcePage: getSourcePage(),
    formType: "consultation",
  };

  try {
    await postToGoogleSheet(payload);
  } catch (error) {
    console.error(error);
    showToast("시트 전송에 실패해 브라우저에 임시 저장했습니다.", "error");
  }

  saveLead(payload);
  trackEvent("lead_submitted", { interest: data.interest, ageGroup: data.ageGroup });

  form.reset();
  updateStep(1);
  showToast("상담 신청이 접수되었습니다. 확인 후 연락드릴 예정입니다.");
  state.submitting.consultation = false;
  setSubmitButtonState(form, false, "");
});

happyRichForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (state.submitting.happyRich) {
    return;
  }

  const fields = [...happyRichForm.querySelectorAll("input")];

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return;
    }
  }

  state.submitting.happyRich = true;
  setSubmitButtonState(happyRichForm, true, "신청 접수 중...");
  showToast("신청 내용을 접수하고 있습니다. 잠시만 기다려주세요.");

  const data = Object.fromEntries(new FormData(happyRichForm).entries());
  const payload = {
    ...data,
    privacy: data.privacy ? "동의" : "",
    submittedAt: new Date().toISOString(),
    sourcePage: getSourcePage(),
    formType: "happy-rich",
  };

  try {
    await postToGoogleSheet(payload);
  } catch (error) {
    console.error(error);
    showToast("시트 전송에 실패해 브라우저에 임시 저장했습니다.", "error");
  }

  saveHappyRichSubscriber(payload);
  trackEvent("happy_rich_submitted", { cityAddress: data.address });

  happyRichForm.reset();
  showToast("행복한 부자 신청이 접수되었습니다. 매월 유용한 정보를 보내드릴게요.");
  state.submitting.happyRich = false;
  setSubmitButtonState(happyRichForm, false, "");
});

trackEvent("page_view", { page: "insurance-funnel-landing" });

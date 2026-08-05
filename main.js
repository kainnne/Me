const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function renderLanguageItem(item) {
  const organization = item.organization.replaceAll("\n", "<br>");
  const bullets = item.bullets.length
    ? `<ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`
    : "";
  return `
    ${item.period ? `<p class="resume-period">${item.period}</p>` : ""}
    <h4>${item.role}</h4>
    ${organization ? `<p class="resume-organization">${organization}</p>` : ""}
    ${bullets}`;
}

function accordionMarkup({ id, index, title, subtitle, summary, content, tone = "" }) {
  return `
    <article class="accordion-item ${tone}">
      <button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="${id}">
        <span class="accordion-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="accordion-title"><strong>${title}</strong><small>${subtitle}</small></span>
        ${summary ? `<span class="accordion-summary">${summary}</span>` : ""}
        <span class="accordion-icon" aria-hidden="true"><i></i><i></i></span>
      </button>
      <div class="accordion-panel" id="${id}" aria-hidden="true"><div class="accordion-panel-inner">${content}</div></div>
    </article>`;
}

function renderSite() {
  const data = resumeData;
  document.title = `${data.englishName} — AI, Learning & Creative Technology`;
  setText("#name", data.name);
  setText("#english-name", data.englishName);
  setText("#headline", data.headline);
  setText("#availability", data.availability);
  setText("#location", data.location);
  setText("#about-title", data.aboutTitle);
  setText("#about-text", data.about);
  setText("#footer-name", data.name);
  setText("#year", new Date().getFullYear());

  $("#facts").innerHTML = data.facts
    .map(([label, value]) => `<div class="fact"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  $("#capability-list").innerHTML = data.capabilities
    .map((item, index) => accordionMarkup({
      id: `capability-${index}`,
      index,
      title: item.name,
      subtitle: item.label,
      summary: item.summary,
      tone: `tone-${index + 1}`,
      content: `<p class="capability-description">${item.description}</p><ul class="tag-list">${item.items.map((skill) => `<li>${skill}</li>`).join("")}</ul>`,
    }))
    .join("");

  $("#highlight-list").innerHTML = data.highlights
    .map((item, index) => `
      <article class="highlight-card card-${index + 1}">
        <div class="highlight-top"><span>${item.type}</span><span>${String(index + 1).padStart(2, "0")}</span></div>
        <div class="highlight-metric">${item.metric}</div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="highlight-foot">${item.foot}</span>
      </article>`)
    .join("");

  $("#resume-detail-list").innerHTML = data.bilingualResume
    .map((section, index) => accordionMarkup({
      id: `resume-${index}`,
      index,
      title: section.titleZh,
      subtitle: section.titleEn,
      summary: `${section.items.length} ${section.items.length === 1 ? "entry" : "entries"}`,
      content: section.items.map((item) => `
        <article class="bilingual-item">
          <div class="language-block" lang="zh-Hant">${renderLanguageItem(item.zh)}</div>
          <div class="language-block" lang="en">${renderLanguageItem(item.en)}</div>
        </article>`).join(""),
    }))
    .join("");

  const emailLink = $("#email-link");
  emailLink.href = `mailto:${data.email}`;
  const copyButton = $("#copy-email");
  copyButton.dataset.email = data.email;
  const phoneLink = $("#phone-link");
  phoneLink.href = `tel:${data.phone.replaceAll(" ", "")}`;
  phoneLink.textContent = data.phone;
  $("#social-links").innerHTML = data.socials
    .map((social) => `<a href="${social.url}" target="_blank" rel="noreferrer">${social.label} ↗</a>`)
    .join("");
}

function setupAccordions() {
  $$(".accordion-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      const group = item.parentElement;
      const isOpen = item.classList.contains("is-open");

      $$(".accordion-item.is-open", group).forEach((openItem) => {
        openItem.classList.remove("is-open");
        $(".accordion-trigger", openItem).setAttribute("aria-expanded", "false");
        $(".accordion-panel", openItem).setAttribute("aria-hidden", "true");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        $(".accordion-panel", item).setAttribute("aria-hidden", "false");
      }
    });
  });
}

function setupMenu() {
  const button = $(".menu-toggle");
  const nav = $(".site-nav");
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  $$("a", nav).forEach((link) => link.addEventListener("click", () => {
    button.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }));
}

function setupReveal() {
  const elements = $$(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function setupMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const hero = $(".hero");
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 18}px`);
    hero.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 18}px`);
  });
}

function setupHeader() {
  const header = $("[data-header]");
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupCopyEmail() {
  const button = $("#copy-email");
  const toast = $(".toast");
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.email);
      toast.textContent = "Email 已複製";
    } catch {
      toast.textContent = button.dataset.email;
    }
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  });
}

renderSite();
setupAccordions();
setupMenu();
setupReveal();
setupMotion();
setupHeader();
setupCopyEmail();

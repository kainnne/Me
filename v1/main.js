const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  $(selector).textContent = value;
}

function renderResume() {
  const data = resumeData;
  document.title = `${data.name}｜個人履歷`;
  setText("#name", data.name);
  setText("#english-name", data.englishName);
  setText("#footer-name", data.name);
  setText("#headline", data.headline);
  setText("#location", data.location);
  setText("#availability", data.availability);
  setText("#role-label", data.role);
  setText("#about-title", data.aboutTitle);
  setText("#about-text", data.about);
  setText("#year", new Date().getFullYear());

  $("#facts").innerHTML = data.facts
    .map(([label, value]) => `<div class="fact"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  $("#experience-list").innerHTML = data.experiences
    .map(
      (item) => `
        <article class="timeline-item">
          <p class="period">${item.period}</p>
          <div><h3>${item.role}</h3><p class="company">${item.company}</p></div>
          <p class="description">${item.description}</p>
        </article>`,
    )
    .join("");

  $("#resume-detail-list").innerHTML = data.bilingualResume
    .map(
      (section) => `
        <section class="resume-category">
          <h3>${section.titleZh} <span>/ ${section.titleEn}</span></h3>
          ${section.items.map((item) => `
            <article class="bilingual-item">
              <div class="language-block" lang="zh-Hant">${renderLanguageItem(item.zh)}</div>
              <div class="language-block" lang="en">${renderLanguageItem(item.en)}</div>
            </article>`).join("")}
        </section>`,
    )
    .join("");

  $("#skill-groups").innerHTML = data.skills
    .map(
      (group) => `
        <section class="skill-group"><h3>${group.name}</h3>
          <ul>${group.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>`,
    )
    .join("");

  $("#project-list").innerHTML = data.projects
    .map(
      (project, index) => `
        <article class="project-card project-${index + 1}">
          <p class="project-type">${project.type}</p>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a href="${project.link}" ${project.link !== "#" ? 'target="_blank" rel="noreferrer"' : ""}>${project.linkLabel} <span>↗</span></a>
        </article>`,
    )
    .join("");

  const emailLink = $("#email-link");
  emailLink.href = `mailto:${data.email}`;
  emailLink.firstChild.textContent = `${data.email} `;
  const phoneLink = $("#phone-link");
  phoneLink.href = `tel:${data.phone.replaceAll(" ", "")}`;
  phoneLink.textContent = data.phone;
  $("#social-links").innerHTML = data.socials
    .map((social) => `<a href="${social.url}" target="_blank" rel="noreferrer">${social.label} ↗</a>`)
    .join("");
}

function renderLanguageItem(item) {
  const organization = item.organization.replaceAll("\n", "<br>");
  return `<p class="resume-period">${item.period}</p><h4>${item.role}</h4>${organization ? `<p class="resume-organization">${organization}</p>` : ""}${item.bullets.length ? `<ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>` : ""}`;
}

function setupMenu() {
  const button = $(".menu-toggle");
  const nav = $(".site-nav");
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }),
  );
}

renderResume();
setupMenu();

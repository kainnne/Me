/* 朱璽 Kaine Zhu 作品集（第四輪第二版，2026-11-18）
   頁首、Contact、字卡互動照 kainnne.com；輪播照哲威揚 v7 script.js。
   色彩：打開 Contact 整頁轉暗、關掉回亮色（kainnne.com 的 navigationTheme）。輪播換張時背景換成那張的淡色調。標題、副標點了不變色。
   函式庫（assets/vendor/zwy）：GSAP 3.13 + ScrollTrigger、Lenis 1.3、Paper Shaders 0.0.72 MeshGradient。 */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined";
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const S = window.SITE;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ===== 圖示（線條，與 kainnne.com 卡片圖示同筆畫） ===== */
const ICONS = {
  concert: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  album: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3a9 9 0 0 1 9 9"/>',
  design: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  game: '<path d="M4 5h11a5 5 0 0 1 5 5v9H9a5 5 0 0 1-5-5z"/><path d="M8 10h7M8 14h5"/>',
  film: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>',
  web: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
  arch: '<rect x="9" y="3" width="6" height="5" rx="1.5"/><rect x="3" y="16" width="6" height="5" rx="1.5"/><rect x="15" y="16" width="6" height="5" rx="1.5"/><path d="M12 8v4M6 16v-2h12v2"/>',
  text: '<path d="M4 6h16M4 12h10M4 18h7"/><path d="m15 17 2 2 4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ""}</svg>`;
$$("[data-icon]").forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
const PLAY = '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg></span>';

/* ===== 色彩 ===== */
const SHADER = {
  rose: ["#fffafc", "#ffd8e7", "#f6c8ff", "#cddcff", "#c9fff0", "#ffb7ce", "#ffffff"], // kainnne.com dream
  blue: ["#fafcff", "#d8e6ff", "#e8d8ff", "#cddcff", "#d6f4ff", "#ffd3e3", "#ffffff"],
  lilac: ["#fcfaff", "#ead8ff", "#f6c8ff", "#dcd6ff", "#ffd8ec", "#e6c8ff", "#ffffff"],
  mint: ["#f8fffd", "#d2f6ee", "#e0f0ff", "#ffd8e7", "#c9fff0", "#d6f7ea", "#ffffff"],
  dusk: ["#160b19", "#3c1733", "#56284c", "#273450", "#21463f", "#742d58", "#1a0c1a"], // kainnne.com dusk
};
let shader = null, tint = "rose"; // 第 01 張 Title 的色調
const mood = () => (root.dataset.mood === "dusk" ? "dusk" : "dream");
const colorsNow = () => (mood() === "dusk" ? SHADER.dusk : SHADER[tint] || SHADER.rose);
(function initShader() {
  const el = $("#bgShader"), P = window.PaperShaders;
  if (!el || !P) return;
  try {
    shader = new P.ShaderMount(el, P.meshGradientFragmentShader, {
      u_colors: colorsNow().map(P.getShaderColorFromString), u_colorsCount: 7,
      u_distortion: 0.82, u_swirl: 0.42, u_grainMixer: 0.06, u_grainOverlay: 0.03,
      u_fit: 0, u_scale: 1, u_rotation: 0, u_offsetX: 0, u_offsetY: 0, u_originX: 0.5, u_originY: 0.5, u_worldWidth: 0, u_worldHeight: 0,
    }, undefined, reduce ? 0 : 0.1, 0, 1, 1280 * 720); // 背景只需要柔和漸層，降解析度與速度，減輕毛玻璃疊在動態背景上的負擔
    document.addEventListener("visibilitychange", () => shader.setSpeed(document.hidden || reduce ? 0 : 0.1));
  } catch (e) { el.remove(); shader = null; }
})();
function paint() {
  $('meta[name="theme-color"]').content = mood() === "dusk" ? "#1a0c1a" : "#FFF7FA";
  if (shader) shader.setUniforms({ u_colors: colorsNow().map(window.PaperShaders.getShaderColorFromString) });
}
function setMood(m) { if (mood() !== m) { root.dataset.mood = m; paint(); } }
function setTint(t) { if (tint !== t) { tint = t; paint(); } }

/* ===== 互動回饋：滑鼠指向＝觸控按住，放開才是點擊 ===== */
$$(".panel").forEach((p) => p.classList.add("ix"));
const ixOf = (t) => (t && t.closest ? t.closest(".ix") : null);
function spot(el, e) {
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", e.clientX - r.left + "px");
  el.style.setProperty("--my", e.clientY - r.top + "px");
}
// 指標光暈與光點：每一幀最多更新一次，變數只寫在背景層與指向中的元素上（寫在 <html> 會讓整頁重算樣式）
const bgPointer = $(".bg__pointer");
let lastMove = null, moveQueued = false;
document.addEventListener("pointermove", (e) => {
  lastMove = e;
  if (moveQueued) return;
  moveQueued = true;
  requestAnimationFrame(() => {
    moveQueued = false;
    const ev = lastMove;
    bgPointer.style.setProperty("--px", ev.clientX + "px");
    bgPointer.style.setProperty("--py", ev.clientY + "px");
    let el = ixOf(ev.target);
    while (el) { spot(el, ev); el = ixOf(el.parentElement); } // 巢狀（卡片裡的按鈕）都更新光點
  });
}, { passive: true });
document.addEventListener("pointerover", (e) => {
  if (e.pointerType !== "mouse") return;
  let el = ixOf(e.target);
  while (el) { el.classList.add("is-hover"); el = ixOf(el.parentElement); }
});
document.addEventListener("pointerout", (e) => {
  let el = ixOf(e.target);
  while (el) { if (!el.contains(e.relatedTarget)) el.classList.remove("is-hover"); el = ixOf(el.parentElement); }
});
let pressed = [], holdTimer = 0;
document.addEventListener("pointerdown", (e) => {
  const el = ixOf(e.target);
  if (!el) return;
  pressed = [];
  let x = el;
  while (x) { pressed.push(x); x = ixOf(x.parentElement); }
  pressed.forEach((p) => { spot(p, e); if (e.pointerType !== "mouse") p.classList.add("is-hover"); }); // 觸控按住＝滑鼠指向
  el.classList.add("is-press");
  clearTimeout(holdTimer);
  if (e.pointerType !== "mouse") holdTimer = setTimeout(() => el.classList.remove("is-press"), 220);
}, { passive: true });
const release = () => {
  clearTimeout(holdTimer);
  const list = pressed; pressed = [];
  list.forEach((el) => {
    el.classList.remove("is-press");
    setTimeout(() => { if (!finePointer.matches || !el.matches(":hover")) el.classList.remove("is-hover"); }, 280);
  });
};
document.addEventListener("pointerup", release, { passive: true });
document.addEventListener("pointercancel", release, { passive: true });
document.addEventListener("contextmenu", (e) => { if (ixOf(e.target) && !e.target.closest("a")) e.preventDefault(); }); // 長按不跳系統選單
document.addEventListener("keydown", (e) => {
  const el = ixOf(document.activeElement);
  if (el && (e.key === "Enter" || e.key === " ")) { el.classList.add("is-press"); setTimeout(() => el.classList.remove("is-press"), 140); }
});
$$(".nav-cell, .contact-popover > a, .contact-copy, .drawer__close").forEach((el) => el.classList.add("ix"));

/* ===== 平滑捲動 ===== */
let lenis = null;
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (!reduce && typeof Lenis !== "undefined" && hasGsap) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(500, 33); // 電腦忙或卡頓時不一次補完時間，避免輪播連跳
}
const hdr = $("#hdr");
function scrollToY(y) {
  if (lenis) { lenis.resize(); lenis.scrollTo(y, { duration: 1.1, force: true }); } // 展開細節後頁面變高，先更新 Lenis 的捲動範圍
  else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}
const topOf = (el) => el.getBoundingClientRect().top + scrollY;
const HDR_SPACE = () => hdr.offsetTop + hdr.offsetHeight + 16;

/* 頁首：往下捲隱藏、往上捲出現 */
let lastY = 0;
function onScroll(y) {
  if (!contactOpen) hdr.classList.toggle("is-hidden", y > lastY && y > 320);
  lastY = y;
}
if (lenis) lenis.on("scroll", ({ scroll }) => onScroll(scroll));
else addEventListener("scroll", () => onScroll(scrollY), { passive: true });

/* 名字：字母依序跳，點了回頂端 */
(function brand() {
  const b = $("#brand");
  let i = 0;
  $$("span", b).forEach((part) => {
    part.innerHTML = [...part.textContent].map((c) => (c === " " ? " " : `<span class="ch" style="--i:${i++}">${esc(c)}</span>`)).join("");
  });
  b.addEventListener("click", (e) => { e.preventDefault(); scrollToY(0); goTitle(); }); // 點名字＝回頂端並跳到 02 Title
})();

/* ===== Contact：收合面板，打開整頁轉暗（kainnne.com） ===== */
const cBtn = $("#contactBtn"), cPop = $("#contactPop");
let contactOpen = false;
function openContact() {
  contactOpen = true;
  cPop.hidden = false;
  cBtn.setAttribute("aria-expanded", "true");
  hdr.classList.remove("is-hidden");
  setMood("dusk");
  if (hasGsap && !reduce) {
    gsap.fromTo(cPop, { autoAlpha: 0, y: -12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" });
    gsap.fromTo($$("a", cPop), { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "expo.out", delay: 0.06 });
  }
}
function closeContact(focus) {
  if (!contactOpen) return;
  contactOpen = false;
  cBtn.setAttribute("aria-expanded", "false");
  setMood("dream");
  const done = () => { cPop.hidden = true; };
  if (hasGsap && !reduce) gsap.to(cPop, { autoAlpha: 0, y: -8, scale: 0.98, duration: 0.2, ease: "power2.in", onComplete: done }); else done();
  if (focus) cBtn.focus();
}
cBtn.addEventListener("click", (e) => { e.stopPropagation(); contactOpen ? closeContact() : openContact(); });
$("#contactClose").addEventListener("click", () => closeContact(true));
$$("a", cPop).forEach((a) => a.addEventListener("click", () => closeContact()));
$$(".contact-copy").forEach((b) => b.addEventListener("click", async () => {
  const t = b.dataset.copy;
  try { await navigator.clipboard.writeText(t); }
  catch (e) { const ta = document.createElement("textarea"); ta.value = t; document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
  b.classList.add("is-copied");
  setTimeout(() => b.classList.remove("is-copied"), 1600);
}));
document.addEventListener("pointerdown", (e) => { if (contactOpen && !e.target.closest(".contact-control")) closeContact(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && contactOpen) closeContact(true); });

/* ===== 放大檢視：圖片與影片共用 ===== */
const LB = (function lightbox() {
  const box = $("#lightbox"), stage = $("#lbStage"), now = $("#lbNow"), all = $("#lbAll"), title = $("#lbTitle");
  let list = [], i = 0, opener = null, sx = null;
  const draw = (dir) => {
    const it = list[i];
    stage.querySelector("video")?.pause();
    stage.innerHTML = it.video
      ? `<video src="${it.video}" poster="${it.poster || ""}" controls playsinline autoplay width="${it.w}" height="${it.h}" aria-label="${esc(it.alt)}"></video>`
      : `<img src="${it.src}" alt="${esc(it.alt)}" width="${it.w}" height="${it.h}">`;
    now.textContent = i + 1;
    all.textContent = "/ " + list.length;
    title.textContent = it.video ? it.alt : "";
    const m = stage.firstElementChild;
    if (hasGsap && !reduce) gsap.fromTo(m, { autoAlpha: 0, x: 40 * (dir || 0), scale: dir ? 1 : 0.94 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.55, ease: "expo.out" });
  };
  const open = (items, k, from) => {
    list = items; i = k; opener = from;
    box.classList.toggle("is-one", list.length < 2);
    box.hidden = false;
    draw(0);
    if (lenis) lenis.stop();
    heroHold("box", true);
    if (hasGsap && !reduce) gsap.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    $(".lightbox__close", box).focus();
  };
  const close = () => {
    const done = () => {
      stage.querySelector("video")?.pause();
      stage.innerHTML = "";
      box.hidden = true;
      if (lenis) lenis.start();
      heroHold("box", false);
      if (opener) opener.focus({ preventScroll: true });
    };
    if (hasGsap && !reduce) gsap.to(box, { autoAlpha: 0, duration: 0.25, onComplete: done }); else done();
  };
  const step = (d) => { if (list.length < 2) return; i = (i + d + list.length) % list.length; draw(d); };
  $(".lightbox__close", box).addEventListener("click", close);
  $(".lightbox__prev", box).addEventListener("click", () => step(-1));
  $(".lightbox__next", box).addEventListener("click", () => step(1));
  box.addEventListener("click", (e) => { if (e.target === box || e.target === stage) close(); });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "Tab") { // 焦點留在檢視裡
      const f = $$("button,video", box).filter((x) => x.offsetParent);
      const k = f.indexOf(document.activeElement);
      if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  stage.addEventListener("pointerdown", (e) => { sx = e.clientX; });
  stage.addEventListener("pointerup", (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) step(e.clientX < sx ? 1 : -1); sx = null; });
  return { open };
})();

function imgFrame(m, k, ratio = true) {
  const ar = ratio ? ` style="--ar:${m.w}/${m.h}"` : "";
  return `<button type="button" class="frame ix" data-k="${k}"${ar} aria-label="放大：${esc(m.alt)}"><img src="${m.src}" alt="${esc(m.alt)}" loading="lazy" width="${m.w}" height="${m.h}"></button>`;
}
function vidFrame(v, k) {
  const tall = v.h > v.w;
  return `<button type="button" class="frame frame--video ix${tall ? " is-tall" : ""}" data-k="${k}" style="--ar:${tall ? "9/16" : "16/9"}" aria-label="播放：${esc(v.title)}"><img src="${v.poster}" alt="${esc(v.title)}" loading="lazy" width="${v.w}" height="${v.h}">${PLAY}${v.len ? `<span class="len">${v.len}</span>` : ""}</button>`;
}
function bindGroup(host, items) {
  $$("[data-k]", host).forEach((b) => b.addEventListener("click", () => { if (!dragGuard()) LB.open(items, Number(b.dataset.k), b); }));
}
const asVid = (v) => ({ video: v.src, poster: v.poster, w: v.w, h: v.h, alt: v.title });
const WORK = (id) => S.WORKS.find((x) => x.id === id);
const vnItems = () => (S.VN_VIDEO.src ? [asVid(S.VN_VIDEO)] : []).concat(WORK("vn").detail.media.map((m) => ({ ...m })));

/* 輪播第 1、4 張的媒體 */
(function heroMedia() {
  // 視覺小說：影片直接在卡片裡播放（不開放大檢視，不附 CG，CG 在下方 Details）
  const vh = $("#vnHero"), V = S.VN_VIDEO;
  vh.innerHTML = V.src
    ? `<video class="vn-inline" controls playsinline preload="metadata" poster="${V.poster}" width="${V.w}" height="${V.h}" aria-label="${esc(V.title)}"><source src="${V.src}" type="video/mp4"></video>`
    : `<img class="vn-inline" src="${V.poster}" alt="視覺小說 CG" width="${V.w}" height="${V.h}">`;
  const vEl = $("video", vh);
  if (vEl) {
    vEl.addEventListener("play", () => heroHold("video", true));
    ["pause", "ended"].forEach((t) => vEl.addEventListener(t, () => heroHold("video", false)));
  }
  const reel = $("#reelHero");
  const vids = S.VIDEOS.filter((v) => v.w > v.h).concat(S.VIDEOS.filter((v) => v.w <= v.h));
  reel.innerHTML = vids.map((v, k) => vidFrame(v, k)).join("");
  $$(".frame", reel).forEach((f) => f.removeAttribute("style"));
  bindGroup(reel, vids.map(asVid));
})();

/* ===== 輪播：自動換頁＋拖曳／滑動＋01–04 分頁 ===== */
const slides = $$(".slide"), steps = $$(".step");
const DUR = 7, HOLD = 1.75; // 每張 7 秒；手動切換後停 DUR×HOLD 秒再回到自動
let cur = 0, prog = null, busy = false, holdNext = false, heroDragged = false;
const hold = { hover: false, view: false, box: false, tab: false, contact: false, role: false, notes: false, video: false };
const tw = (tl, method, els, ...args) => (els.length ? tl[method](els, ...args) : tl);
const parts = (sl) => ({ panel: $$(".panel, .skill", sl), title: $$(".panel__title, .face", sl), body: $$(".eyebrow, .stats, .feature-list > li, .actions", sl), media: $$(".panel__media", sl) });
slides.forEach((sl, i) => { if (i !== cur) { sl.inert = true; } });
function heroHeld() { return Object.values(hold).some(Boolean); }
function heroHold(k, on) { hold[k] = on; syncProg(); }
function syncProg() { if (prog) heroHeld() ? prog.pause() : prog.resume(); }
document.addEventListener("visibilitychange", () => heroHold("tab", document.hidden));
function runProgress() {
  if (prog) prog.kill();
  steps.forEach((s, i) => { $(".step__bar i", s).style.width = i < cur ? "100%" : "0%"; s.classList.toggle("is-done", i < cur); });
  if (!hasGsap || reduce) { $(".step__bar i", steps[cur]).style.width = "100%"; return; }
  const d = holdNext ? DUR * HOLD : DUR;
  holdNext = false;
  prog = gsap.fromTo($(".step__bar i", steps[cur]), { width: "0%" }, { width: "100%", duration: d, ease: "none", onComplete: () => show(cur + 1) });
  syncProg();
}
function manual(n, dir) {
  holdNext = true;
  if ((n + slides.length) % slides.length === cur) runProgress();
  else show(n, dir);
}
function show(n, dir = 1) {
  n = (n + slides.length) % slides.length;
  if (n === cur || busy) return;
  const from = slides[cur], to = slides[n];
  steps.forEach((s, i) => { s.classList.toggle("is-active", i === n); s.setAttribute("aria-selected", String(i === n)); });
  from.setAttribute("aria-hidden", "true"); from.inert = true;
  to.setAttribute("aria-hidden", "false"); to.inert = false;
  setTint(to.dataset.tint);
  if (roleOpen) closeRole(true);
  hold.notes = false;
  $$("video", from).forEach((v) => v.pause());
  fitTrack(to);
  if (!hasGsap || reduce) { from.classList.remove("is-active"); to.classList.add("is-active"); cur = n; runProgress(); return; }
  busy = true;
  const a = parts(from), b = parts(to);
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => { busy = false; } });
  tw(tl, "to", a.panel, { autoAlpha: 0, x: -50 * dir, scale: 0.98, duration: 0.45, stagger: 0.02, ease: "power3.in" }, 0);
  tl.add(() => { from.classList.remove("is-active"); to.classList.add("is-active"); gsap.set(a.panel, { clearProps: "all" }); cur = n; runProgress(); }, 0.45);
  tw(tl, "fromTo", b.panel, { autoAlpha: 0, x: 60 * dir, scale: 0.98 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.9, stagger: 0.04 }, 0.45);
  tw(tl, "fromTo", b.title, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.55);
  tw(tl, "fromTo", b.body, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.04 }, 0.6);
  tw(tl, "fromTo", b.media, { autoAlpha: 0, x: 40 * dir }, { autoAlpha: 1, x: 0, duration: 1 }, 0.55);
}
/* 窄螢幕：輪播高度跟著目前這張，分頁鈕緊接在內容下面（寬螢幕各張高度相近，維持固定） */
const narrow = matchMedia("(max-width: 860px)");
function fitTrack(sl = slides[cur]) {
  const track = $("#heroTrack");
  track.style.height = narrow.matches ? sl.offsetHeight + "px" : "";
}
addEventListener("resize", () => fitTrack());
addEventListener("load", () => fitTrack());
document.fonts && document.fonts.ready.then(() => fitTrack());
fitTrack();
steps.forEach((s, i) => s.addEventListener("click", () => manual(i, i > cur ? 1 : -1)));
$(".steps").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  manual(cur + (e.key === "ArrowRight" ? 1 : -1), e.key === "ArrowRight" ? 1 : -1);
  steps[(cur + (e.key === "ArrowRight" ? 1 : -1) + steps.length) % steps.length].focus();
});
const heroEl = $(".hero");
heroEl.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") heroHold("hover", true); });
heroEl.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") heroHold("hover", false); });
new IntersectionObserver(([en]) => heroHold("view", !en.isIntersecting), { threshold: 0.25 }).observe(heroEl);
function dragGuard() { if (heroDragged) { heroDragged = false; return true; } return false; }
(function heroDrag() {
  const track = $("#heroTrack");
  let x0 = null, y0 = 0, dx = 0, id = null, moved = false;
  track.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("video")) return; // 在影片上拖曳是調進度，不換張
    x0 = e.clientX; y0 = e.clientY; dx = 0; id = e.pointerId; moved = false; heroDragged = false;
  });
  track.addEventListener("pointermove", (e) => {
    if (x0 === null || e.pointerId !== id) return;
    dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(e.clientY - y0) * 1.2) { moved = true; track.setPointerCapture(id); track.classList.add("is-drag"); }
    if (moved && hasGsap && !busy) gsap.set(slides[cur], { x: dx * 0.35 });
  });
  const end = () => {
    if (x0 === null) return;
    track.classList.remove("is-drag");
    if (moved) {
      heroDragged = true;
      setTimeout(() => { heroDragged = false; }, 60);
      if (hasGsap) gsap.to(slides[cur], { x: 0, duration: 0.6, ease: "expo.out" });
      if (Math.abs(dx) > 56) manual(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
    x0 = null;
  };
  track.addEventListener("pointerup", end);
  track.addEventListener("pointercancel", end);
  track.addEventListener("click", (e) => { if (heroDragged) { e.preventDefault(); e.stopPropagation(); } }, true);
})();

/* 點名字：跳到 02 Title。已經在 Title 時，同一張照樣淡出再淡入。 */
const TITLE = 0; // Title 是第 01 張
function goTitle() {
  if (cur !== TITLE) { manual(TITLE, TITLE > cur ? 1 : -1); return; }
  if (busy) return;
  if (roleOpen) closeRole(true);
  holdNext = true;
  if (!hasGsap || reduce) { runProgress(); return; }
  busy = true;
  const a = parts(slides[cur]);
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => { busy = false; gsap.set([...a.panel, ...a.title, ...a.body], { clearProps: "all" }); } });
  tw(tl, "to", a.panel, { autoAlpha: 0, y: -14, scale: 0.98, duration: 0.35, ease: "power3.in" }, 0);
  tl.add(runProgress, 0.35);
  tw(tl, "fromTo", a.panel, { autoAlpha: 0, y: 18, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 }, 0.38);
  tw(tl, "fromTo", a.title, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.45);
  tw(tl, "fromTo", a.body, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05 }, 0.5);
}

/* ===== 02 Title：點頭銜→那列移到最上面、其餘收起、下面出現 104 原文說明。右上角 ✕ 或 Esc 回到三個頭銜。 ===== */
const roleBtns = $$(".role"), roleDetail = $("#roleDetail"), roleClose = $("#roleClose");
let roleOpen = null;
function openRole(btn) {
  if (roleOpen) return;
  roleOpen = btn;
  const li = btn.parentElement, others = $$("#roles > li").filter((x) => x !== li);
  const r = S.ROLES[btn.dataset.role];
  roleDetail.innerHTML = `<p>${esc(r.lead)}</p><ol class="feature-list">${r.items.map((t, k) => `<li><span>${String(k + 1).padStart(2, "0")}</span>${esc(t)}</li>`).join("")}</ol>`;
  btn.setAttribute("aria-expanded", "true");
  roleClose.hidden = false;
  heroHold("role", true);
  const done = () => { others.forEach((o) => { o.hidden = true; }); roleDetail.hidden = false; fitTrack(); };
  if (!hasGsap || reduce) { done(); roleClose.focus(); return; }
  // FLIP：只動 transform 與 opacity（不動 height），避免每一格都重排整張卡片造成卡頓
  const first = li.getBoundingClientRect().top;
  gsap.to(others, { autoAlpha: 0, y: -8, duration: 0.18, ease: "power2.in", onComplete: () => {
    done();
    gsap.set(others, { clearProps: "opacity,visibility,transform" });
    const last = li.getBoundingClientRect().top;
    gsap.fromTo(li, { y: first - last }, { y: 0, duration: 0.55, ease: "expo.out", clearProps: "transform" });
    gsap.fromTo([roleDetail.firstElementChild, ...$$(".feature-list li", roleDetail)], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.05, ease: "expo.out", delay: 0.08, clearProps: "transform" });
  } });
  gsap.fromTo(roleClose, { autoAlpha: 0, scale: 0.6, rotate: -90 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" });
  roleClose.focus({ preventScroll: true });
}
function closeRole(instant) {
  if (!roleOpen) return;
  const btn = roleOpen;
  roleOpen = null;
  btn.setAttribute("aria-expanded", "false");
  roleClose.hidden = true;
  const li = btn.parentElement, first = li.getBoundingClientRect().top;
  roleDetail.hidden = true;
  roleDetail.innerHTML = "";
  const others = $$("#roles > li").filter((x) => x.hidden);
  others.forEach((o) => { o.hidden = false; });
  heroHold("role", false);
  fitTrack();
  if (!instant && hasGsap && !reduce) { // FLIP：被選的那列滑回原位，其餘淡入
    const last = li.getBoundingClientRect().top;
    gsap.fromTo(li, { y: first - last }, { y: 0, duration: 0.55, ease: "expo.out", clearProps: "transform" });
    gsap.fromTo(others, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "expo.out", stagger: 0.05, delay: 0.05, clearProps: "opacity,visibility,transform" });
  }
  if (!instant) btn.focus({ preventScroll: true });
}
roleBtns.forEach((b) => b.addEventListener("click", () => { if (!dragGuard() && !roleOpen) openRole(b); }));
roleClose.addEventListener("click", () => closeRole());
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && roleOpen && $("#lightbox").hidden && !contactOpen) closeRole(); });

/* ===== 作品字卡（kainnne.com 專案卡），兩張一組 ===== */
const grid = $("#grid");
const isCJK = (t) => /[㐀-鿿]/.test(t);
grid.innerHTML = S.WORKS.map((w, n) => `
  <article class="project-card ix tone-${w.tone}" data-id="${w.id}" id="work-${w.id}">
    <span class="card__spot" aria-hidden="true"></span>
    <div class="card__head"><span class="num">${String(n + 1).padStart(2, "0")}</span><span class="icon-tile">${icon(w.icon)}</span><span class="badge${w.ai ? "" : " badge--hand"}">${w.ai ? "AI 協作" : "非 AI"}</span></div>
    <div class="card__copy"><p class="card__type">${esc(w.type)}</p><h3 class="card__title${isCJK(w.title) ? " is-cjk" : ""}">${esc(w.title)}</h3></div>
    <ol class="feature-list">${w.ways.map((x, k) => `<li><span>${String(k + 1).padStart(2, "0")}</span>${esc(x)}</li>`).join("")}</ol>
    <div class="actions">
      ${w.open ? `<a class="act act--main ix" href="${w.open}" target="_blank" rel="noopener">Open</a>` : ""}
      <button class="act ix${w.open ? "" : " act--main"}" type="button" data-details aria-expanded="false" aria-controls="drawer">Details</button>
    </div>
  </article>`).join("");
const cards = $$(".project-card", grid);
$$(".project-card .actions", grid).forEach((a) => { if (a.children.length === 1) a.style.gridTemplateColumns = "1fr"; });
cards.forEach((c) => {
  $("[data-details]", c).addEventListener("click", (e) => { e.stopPropagation(); toggle(c); });
  c.addEventListener("click", (e) => { if (!e.target.closest("a, button")) toggle(c); });
});

/* ===== 展開細節：插在該列下方 ===== */
const drawer = document.createElement("div");
drawer.className = "drawer";
drawer.id = "drawer";
drawer.setAttribute("role", "region");
drawer.hidden = true;
let openCard = null, audio = null;
const cols = () => getComputedStyle(grid).gridTemplateColumns.split(" ").length;
function placeDrawer() {
  if (!openCard) return;
  const i = cards.indexOf(openCard), c = cols();
  const end = Math.min(cards.length - 1, i - (i % c) + c - 1);
  cards[end].after(drawer);
}
addEventListener("resize", placeDrawer);
function fmt(t) { if (!isFinite(t)) return "0:00"; const m = Math.floor(t / 60), s = Math.floor(t % 60); return m + ":" + String(s).padStart(2, "0"); }
function detailHTML(w) {
  const d = w.detail || {};
  const info = [`<h3 class="drawer__title">${esc(w.title)}</h3>`];
  if (d.track) info.push(`<div class="player"><button type="button" class="player__btn ix" aria-label="播放：${esc(S.TRACKS[d.track].title)}"><svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg></button><div class="player__bar" role="slider" tabindex="0" aria-label="播放位置" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><span class="player__t">0:00</span></div>`);
  if (d.facts) info.push(`<dl class="facts">${d.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`);
  if (d.links) info.push(`<ul class="links">${d.links.map((l) => `<li><a class="act ix" href="${l.href}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>`);
  let media = "", group = [];
  if (d.videos) {
    group = S.VIDEOS.map(asVid);
    media = `<div class="drawer__media is-wide">${S.VIDEOS.map((v, k) => vidFrame(v, k)).join("")}</div>`;
  } else if (d.vnVideo) {
    group = vnItems();
    const off = S.VN_VIDEO.src ? 1 : 0;
    media = `<div class="drawer__media is-wide">${off ? `<div class="drawer__video">${vidFrame(S.VN_VIDEO, 0)}</div>` : ""}${d.media.map((m, k) => imgFrame(m, k + off)).join("")}</div>`;
  } else if (d.pieces) {
    group = d.pieces.map((m) => ({ src: m.src, w: m.w, h: m.h, alt: m.type + " " + m.title }));
    media = `<div class="pieces">${d.pieces.map((m, k) => `<button type="button" class="piece ix tone-${m.tone}" data-k="${k}" aria-label="放大：${esc(m.type + " " + m.title)}"><span class="piece__head"><span class="num">${String(k + 1).padStart(2, "0")}</span><span class="piece__type">${esc(m.type)}</span></span><span class="piece__img"><img src="${m.src}" alt="${esc(m.type + " " + m.title)}" loading="lazy" width="${m.w}" height="${m.h}"></span><b>${esc(m.title)}</b></button>`).join("")}</div>`;
  } else if (d.media) {
    group = d.media;
    media = `<div class="drawer__media${d.media.length === 1 && d.media[0].w > d.media[0].h ? " is-wide" : ""}">${d.media.map((m, k) => imgFrame(m, k)).join("")}</div>`;
  }
  const fold = d.fold ? `<details class="fold"><summary class="ix">${esc(d.fold.label)}<i class="plus" aria-hidden="true"></i></summary><table class="roles-t"><thead><tr>${d.fold.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${d.fold.rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table></details>` : "";
  return { html: `<span class="card__spot" aria-hidden="true"></span><button type="button" class="drawer__close ix" aria-label="收合"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="drawer__in${media && !d.pieces ? "" : " is-single"}"><div class="drawer__info">${info.join("")}</div>${media}${fold}</div>`, group };
}
function bindPlayer(w) {
  const p = $(".player", drawer);
  if (!p) return;
  const t = S.TRACKS[w.detail.track];
  audio = new Audio(t.src);
  audio.preload = "metadata";
  const btn = $(".player__btn", p), bar = $(".player__bar", p), bi = $("i", bar), time = $(".player__t", p);
  const PLAYI = '<svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg>', PAUSEI = '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  const sync = () => {
    const r = audio.duration ? audio.currentTime / audio.duration : 0;
    bi.style.width = r * 100 + "%";
    bar.setAttribute("aria-valuenow", Math.round(r * 100));
    time.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
  };
  audio.addEventListener("timeupdate", sync);
  audio.addEventListener("loadedmetadata", sync);
  audio.addEventListener("play", () => { btn.innerHTML = PAUSEI; btn.setAttribute("aria-label", "暫停"); });
  audio.addEventListener("pause", () => { btn.innerHTML = PLAYI; btn.setAttribute("aria-label", "播放：" + t.title); });
  btn.addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
  const seek = (e) => { const r = bar.getBoundingClientRect(); if (audio.duration) audio.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * audio.duration; };
  let drag = false;
  bar.addEventListener("pointerdown", (e) => { drag = true; bar.setPointerCapture(e.pointerId); seek(e); });
  bar.addEventListener("pointermove", (e) => { if (drag) seek(e); });
  bar.addEventListener("pointerup", () => { drag = false; });
  bar.addEventListener("keydown", (e) => {
    if (!audio.duration) return;
    if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
}
function stopAudio() { if (audio) { audio.pause(); audio = null; } }
function setOpen(c, on) {
  c.classList.toggle("is-open", on);
  $("[data-details]", c).setAttribute("aria-expanded", String(on));
}
function toggle(c, opts = {}) {
  if (openCard === c && !opts.force) { closeDrawer(true); return; }
  const w = WORK(c.dataset.id);
  if (openCard) setOpen(openCard, false);
  stopAudio();
  const wasHidden = drawer.hidden;
  openCard = c;
  setOpen(c, true);
  const { html, group } = detailHTML(w);
  drawer.className = "drawer ix tone-" + w.tone;
  drawer.setAttribute("aria-label", w.type + " " + w.title);
  drawer.innerHTML = html;
  placeDrawer();
  drawer.hidden = false;
  bindGroup(drawer, group);
  bindPlayer(w);
  $(".drawer__close", drawer).addEventListener("click", () => closeDrawer(true));
  if (hasGsap && !reduce) {
    if (wasHidden) gsap.fromTo(drawer, { height: 0, autoAlpha: 0 }, { height: "auto", autoAlpha: 1, duration: 0.7, ease: "expo.out", clearProps: "height" });
    gsap.fromTo($$(".drawer__info > *, .drawer__media > *, .piece, .fold", drawer), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "expo.out" });
  }
  if (opts.scroll !== false) setTimeout(() => {
    const r = drawer.getBoundingClientRect();
    if (r.top > innerHeight * 0.62 || r.top < HDR_SPACE()) scrollToY(topOf(drawer) - Math.min(260, innerHeight * 0.3));
  }, 80);
}
function closeDrawer(focusCard) {
  if (!openCard) return;
  const c = openCard;
  openCard = null;
  stopAudio();
  setOpen(c, false);
  const done = () => { drawer.hidden = true; drawer.innerHTML = ""; };
  if (hasGsap && !reduce) gsap.to(drawer, { height: 0, autoAlpha: 0, duration: 0.45, ease: "power3.inOut", onComplete: () => { done(); gsap.set(drawer, { clearProps: "all" }); } });
  else done();
  if (focusCard) $("[data-details]", c).focus({ preventScroll: true });
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && openCard && $("#lightbox").hidden && !contactOpen) closeDrawer(true); });

/* 輪播的 Details：展開該作品並捲過去 */
$$("[data-open]").forEach((b) => b.addEventListener("click", () => {
  if (dragGuard()) return;
  const c = cards.find((x) => x.dataset.id === b.dataset.open);
  toggle(c, { force: true, scroll: false });
  setTimeout(() => scrollToY(topOf(c) - HDR_SPACE()), 60);
}));

/* 能力卡＝錨點：點了跳到對應作品並展開（文字規範 → 05 Design） */
$$(".skill[data-go]").forEach((sk) => {
  sk.tabIndex = 0;
  sk.setAttribute("role", "link");
  const go = () => {
    if (dragGuard()) return;
    const t = sk.dataset.go;
    if (t.startsWith("slide:")) { manual(Number(t.slice(6)), 1); return; }
    const c = cards.find((x) => x.dataset.id === t);
    toggle(c, { force: true, scroll: false });
    setTimeout(() => scrollToY(topOf(c) - HDR_SPACE()), 60);
  };
  sk.setAttribute("aria-label", $("b", sk).textContent + "：" + (sk.dataset.go.startsWith("slide:") ? "看 Design" : "看對應作品"));
  sk.addEventListener("click", go);
  sk.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
});

/* 05 Design 清單：開始滑動或觸碰就暫停輪播，換張後恢復 */
const notes = $("#notes");
["wheel", "touchstart", "scroll"].forEach((t) => notes.addEventListener(t, () => heroHold("notes", true), { passive: true }));

/* ===== 啟動 ===== */
paint();
if (hasGsap && !reduce) {
  const s = parts(slides[0]);
  const tl0 = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: runProgress });
  tl0.from(".site-nav", { y: -16, autoAlpha: 0, duration: 0.8, clearProps: "transform,opacity,visibility" }, 0); // 動內層，頁首本身的 translateX(-50%) 與隱藏不受影響
  tw(tl0, "from", s.panel, { autoAlpha: 0, y: 30, scale: 0.98, duration: 1.1 }, 0.1);
  tw(tl0, "from", s.title, { autoAlpha: 0, y: 26, duration: 1 }, 0.25);
  tw(tl0, "from", s.body, { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.05 }, 0.35);
  tw(tl0, "from", s.media, { autoAlpha: 0, x: 30, duration: 1.1 }, 0.3);
  tl0.from(steps, { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.06 }, 0.45);
  /* 作品字卡第一次捲進來時依序浮上（只做一次） */
  gsap.set(cards, { autoAlpha: 0, y: 30 });
  ScrollTrigger.batch(cards, { start: "top 90%", once: true, onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 }) });
} else runProgress();

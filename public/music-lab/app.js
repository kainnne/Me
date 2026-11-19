(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var TRACKS = window.TRACKS || {};
  var WAVES = window.WAVEFORMS || {};
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ===== 指向光點、指向狀態、按壓行程。觸控按住給同樣回饋（同哲威揚 v7 的 .ix） ===== */
  var SEL = '.ix, .nd';
  function ixOf(t) { return t && t.closest ? t.closest(SEL) : null; }
  function setSpot(el, e) {
    if (!el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }
  var hovered = null, pressed = null, lastPointer = 'mouse';
  document.addEventListener('pointermove', function (e) {
    var el = ixOf(e.target);
    if (e.pointerType === 'mouse' && el !== hovered) {
      if (hovered) hovered.classList.remove('is-hover');
      hovered = el;
      if (el) el.classList.add('is-hover');
    }
    if (el) setSpot(el, e);
    // 卡片本身的指向狀態（光球位移、條列滑動）
    if (e.pointerType === 'mouse') {
      var pc = e.target.closest && e.target.closest('.pc');
      $$('.pc.is-hover').forEach(function (c) { if (c !== pc) c.classList.remove('is-hover'); });
      if (pc) { pc.classList.add('is-hover'); setSpot(pc, e); }
    }
  }, { passive: true });
  document.addEventListener('pointerleave', function () {
    if (hovered) { hovered.classList.remove('is-hover'); hovered = null; }
  });
  document.addEventListener('pointerdown', function (e) {
    lastPointer = e.pointerType;
    var el = ixOf(e.target);
    if (!el || e.button > 0) return;
    setSpot(el, e);
    el.classList.add('is-press');
    if (e.pointerType !== 'mouse') el.classList.add('is-hover');
    pressed = el;
    if (e.pointerType !== 'mouse') {
      var pc = e.target.closest('.pc');
      if (pc) pc.classList.add('is-hover');
    }
  }, { passive: true, capture: true });
  function release() {
    if (pressed) {
      pressed.classList.remove('is-press');
      if (lastPointer !== 'mouse') pressed.classList.remove('is-hover');
      pressed = null;
    }
    if (lastPointer !== 'mouse') $$('.pc.is-hover').forEach(function (c) { c.classList.remove('is-hover'); });
  }
  document.addEventListener('pointerup', release, { passive: true });
  document.addEventListener('pointercancel', release, { passive: true });
  window.addEventListener('blur', release);
  // 觸控長按互動元件不跳出系統選單
  document.addEventListener('contextmenu', function (e) {
    if (ixOf(e.target) && lastPointer !== 'mouse') e.preventDefault();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = ixOf(document.activeElement);
    if (!el) return;
    el.classList.add('is-press');
    setTimeout(function () { el.classList.remove('is-press'); }, 140);
  });

  /* 背景光暈跟著指標 */
  var glow = $('.bg-glow');
  var graf = 0;
  window.addEventListener('pointermove', function (e) {
    if (reduce.matches || e.pointerType !== 'mouse' || graf) return;
    graf = requestAnimationFrame(function () {
      graf = 0;
      glow.style.setProperty('--gx', e.clientX + 'px');
      glow.style.setProperty('--gy', e.clientY + 'px');
    });
  }, { passive: true });

  /* 頁首：捲動後加底色，手機上收成只剩選單的一列 */
  var bar = $('#bar');
  function onScroll() {
    bar.classList.toggle('is-solid', window.scrollY > 24);
    bar.classList.toggle('is-compact', window.scrollY > 40);
    markNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===== 收合 ===== */
  function setOpen(fold, open) {
    var head = $('.fold-head', fold);
    var body = $('.fold-body', fold);
    fold.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
    if (open) body.removeAttribute('inert'); else body.setAttribute('inert', '');
  }
  $$('[data-fold]').forEach(function (fold) {
    $('.fold-head', fold).addEventListener('click', function () { setOpen(fold, !fold.classList.contains('is-open')); });
  });

  /* ===== 常駐選單：錨點跳轉、標示目前區塊 ===== */
  var navLinks = $$('.nav-a');
  var navSecs = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var navLock = null;
  function setCurrent(id) {
    navLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  function markNav() {
    if (navLock) { setCurrent(navLock); return; }
    var line = bar.getBoundingClientRect().bottom + 48, id = '';
    navSecs.forEach(function (sec) { if (sec && sec.getBoundingClientRect().top <= line) id = sec.id; });
    setCurrent(id);
  }
  function openSecFold(sec) {
    var f = sec && $('.fold-sec', sec);
    if (f && !f.classList.contains('is-open')) setOpen(f, true);
  }
  function goSection(id, smooth) {
    var sec = document.getElementById(id);
    if (!sec) return;
    var f = sec && $('.fold-sec', sec);
    var opening = f && !f.classList.contains('is-open');
    openSecFold(sec);
    navLock = id;
    setCurrent(id);
    var behavior = smooth && !reduce.matches ? 'smooth' : 'auto';
    sec.scrollIntoView({ behavior: behavior, block: 'start' });
    // 收合區塊展開需要 0.5 秒，展開前頁面不夠長，展開後再對齊一次
    if (opening) setTimeout(function () { if (navLock === id) sec.scrollIntoView({ behavior: behavior, block: 'start' }); }, 560);
  }
  ['wheel', 'touchstart', 'keydown'].forEach(function (t) {
    window.addEventListener(t, function () { navLock = null; }, { passive: true });
  });
  navLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var id = a.getAttribute('href').slice(1);
      goSection(id, true);
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });
  });
  onScroll();

  /* ===== 架構圖：點步驟展開對應細節 ===== */
  var nodes = $$('.nd');
  function goStep(id, node) {
    var fold = document.getElementById(id);
    if (!fold) return;
    nodes.forEach(function (n) { n.classList.toggle('is-on', n.getAttribute('data-step') === id); });
    setOpen(fold, true);
    fold.classList.add('is-flash');
    setTimeout(function () { fold.classList.remove('is-flash'); }, 900);
    var r = fold.getBoundingClientRect();
    if (r.top < 70 || r.top > window.innerHeight - 120) {
      fold.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'center' });
    }
  }
  nodes.forEach(function (n) {
    n.addEventListener('click', function () { goStep(n.getAttribute('data-step'), n); });
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStep(n.getAttribute('data-step'), n); }
    });
  });

  /* ===== 播放器 ===== */
  var players = {};
  var playing = null;
  var waveId = 0;

  var LOGIC_BASE = 'https://github.com/kainnne/Me/releases/download/music-lab-logic-v1/';
  function src(file) { return file.replace(/^\/+/, ''); }
  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function buildWave(peaks, cls) {
    var svg = document.createElementNS(SVGNS, 'svg');
    var n = peaks.length, h = 40;
    svg.setAttribute('viewBox', '0 0 ' + n + ' ' + h);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', cls);
    svg.setAttribute('aria-hidden', 'true');
    if (cls === 'w-played') {
      var id = 'wg' + (++waveId);
      svg.innerHTML = '<defs><linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#e3a2bb"/><stop offset=".55" stop-color="#c36f92"/><stop offset="1" stop-color="#9a86c9"/></linearGradient></defs>';
      svg.style.setProperty('--wg', 'url(#' + id + ')');
      svg._fill = 'url(#' + id + ')';
    }
    for (var i = 0; i < n; i++) {
      var bh = Math.max(0.06, peaks[i]) * (h - 2);
      var r = document.createElementNS(SVGNS, 'rect');
      r.setAttribute('x', i + 0.2);
      r.setAttribute('width', 0.6);
      r.setAttribute('y', (h - bh) / 2);
      r.setAttribute('height', bh);
      r.setAttribute('rx', 0.3);
      if (svg._fill) r.setAttribute('style', 'fill:' + svg._fill);
      svg.appendChild(r);
    }
    return svg;
  }

  function Player(card) {
    var self = this;
    this.card = card;
    this.id = card.getAttribute('data-song');
    this.title = card.getAttribute('data-title');
    this.cfg = TRACKS[this.id] || { versions: [] };
    this.el = $('.player', card);
    this.playBtn = $('.play', this.el);
    this.wave = $('.wave', this.el);
    this.cur = $('.cur', this.el);
    this.dur = $('.dur', this.el);
    this.status = $('.status', this.el);
    this.nowV = $('.now-v', this.el);
    this.audio = null;

    // 可播放的選項：有音檔的版本＋生成原曲對照
    this.opts = [];
    this.cfg.versions.forEach(function (v, i) { if (v.file) self.opts.push({ key: 'v' + i, idx: i, file: v.file, label: v.v, v: v }); });
    if (this.cfg.ref && this.cfg.ref.file) this.opts.push({ key: 'ref', file: this.cfg.ref.file, label: this.cfg.ref.label, ref: true });
    var levels = this.opts.map(function (o) { var w = WAVES[o.file]; return w ? w.lufs : null; }).filter(function (x) { return x !== null; });
    this.minLufs = levels.length ? Math.min.apply(null, levels) : null;
    var lastV = this.opts.filter(function (o) { return !o.ref; }).pop();
    this.key = lastV ? lastV.key : (this.opts[0] && this.opts[0].key);

    // 版本數線：一條橫線上排 v1…vN，點節點切換播放的版本。窄螢幕放不下時平均分成兩列（每格至少 34px）
    this.line = $('.vline', this.el);
    this.read = $('.vread', this.el);
    this.refBtn = $('.refbtn', this.el);
    var refOpt = this.opts.filter(function (o) { return o.ref; })[0];
    if (refOpt) this.refBtn.addEventListener('click', function () { self.select(self.key === 'ref' ? self.lastKey : 'ref'); self.play(); });
    else this.refBtn.hidden = true;
    this.lastKey = this.key;
    this.nodes = this.cfg.versions.map(function (v, i) {
      var b = el('button', 'vnode ix');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('data-key', 'v' + i);
      b.setAttribute('aria-label', v.v + '，' + v.date);
      b.innerHTML = '<i aria-hidden="true"></i>';
      b.appendChild(el('span', 'vnode-v', v.v));
      if (!v.file) b.classList.add('is-nofile');
      b.addEventListener('click', function () {
        if (!v.file) { self.showText(i); return; }
        self.select('v' + i);
        self.play();
      });
      b.addEventListener('keydown', function (e) {
        var j = -1, n = self.nodes.length;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(n - 1, i + 1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(0, i - 1);
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = n - 1;
        if (j >= 0 && j !== i) {
          e.preventDefault();
          self.nodes[j].focus();
          if (self.cfg.versions[j].file) self.select('v' + j); else self.showText(j);
        }
      });
      return b;
    });
    this.cols = 0;
    this.layoutLine();
    if ('ResizeObserver' in window) new ResizeObserver(function () { self.layoutLine(); }).observe(this.el);
    else window.addEventListener('resize', function () { self.layoutLine(); });

    this.playBtn.addEventListener('click', function () { self.toggle(); });

    var dragging = false;
    var ratio = function (e) {
      var rect = self.wave.getBoundingClientRect();
      return Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
    };
    this.wave.addEventListener('pointerdown', function (e) {
      dragging = true;
      self.wave.classList.add('is-drag');
      try { self.wave.setPointerCapture(e.pointerId); } catch (err) { /* 略過 */ }
      self.hoverAt(ratio(e));
      self.seekTo(ratio(e) * self.duration());
    });
    this.wave.addEventListener('pointermove', function (e) {
      self.hoverAt(ratio(e));
      if (dragging) self.seekTo(ratio(e) * self.duration());
    });
    var stop = function () { dragging = false; self.wave.classList.remove('is-drag'); };
    this.wave.addEventListener('pointerup', stop);
    this.wave.addEventListener('pointercancel', stop);
    this.wave.addEventListener('keydown', function (e) {
      var t = self.audio ? self.audio.currentTime : 0;
      if (e.key === 'ArrowRight') { e.preventDefault(); self.seekTo(t + 5); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); self.seekTo(t - 5); }
      else if (e.key === 'Home') { e.preventDefault(); self.seekTo(0); }
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); self.toggle(); }
    });

    this.render();
  }
  Player.prototype.opt = function () {
    var k = this.key;
    return this.opts.filter(function (o) { return o.key === k; })[0];
  };
  Player.prototype.meta = function () { return WAVES[this.opt().file]; };
  Player.prototype.duration = function () {
    if (this.audio && isFinite(this.audio.duration)) return this.audio.duration;
    var m = this.meta();
    return m ? m.dur : 0;
  };
  Player.prototype.gain = function () {
    var m = this.meta();
    if (!m || this.minLufs === null) return 1;
    return Math.min(1, Math.pow(10, (this.minLufs - m.lufs) / 20));
  };
  Player.prototype.hoverAt = function (r) {
    var h = $('.wave-hover', this.wave);
    if (h) h.style.transform = 'translateX(' + (r * this.wave.clientWidth) + 'px)';
  };
  Player.prototype.label = function () {
    var o = this.opt();
    return o.ref ? o.label : o.label;
  };
  Player.prototype.layoutLine = function () {
    var n = this.nodes.length;
    if (!n) return;
    var w = this.line.clientWidth || this.el.clientWidth;
    var fit = Math.max(1, Math.floor(w / 34));
    var rows = Math.ceil(n / Math.min(n, fit));
    var per = Math.ceil(n / rows);
    if (per === this.cols) return;
    this.cols = per;
    this.line.innerHTML = '';
    for (var r = 0; r < rows; r++) {
      var row = el('div', 'vrow' + (r > 0 ? ' is-cont' : ''));
      row.style.setProperty('--n', per);
      this.nodes.slice(r * per, (r + 1) * per).forEach(function (b) { row.appendChild(b); });
      this.line.appendChild(row);
    }
    this.line.classList.toggle('is-wrap', rows > 1);
  };
  Player.prototype.showText = function (i) {
    var v = this.cfg.versions[i], last = this.cfg.versions.length - 1;
    this.read.innerHTML = '';
    this.read.appendChild(el('b', 'r-id', v.v));
    this.read.appendChild(el('span', 'r-t', v.text));
    this.read.appendChild(el('small', 'r-d', v.date + (i === last ? '・最新版' : '')));
    if (v.logic) {
      var dl = el('a', 'r-dl ix', '下載 Logic 工程（' + v.logic.size + '）');
      dl.href = LOGIC_BASE + v.logic.file;
      dl.setAttribute('download', '');
      this.read.appendChild(dl);
    }
  };
  Player.prototype.render = function () {
    var self = this;
    var o = this.opt();
    this.nodes.forEach(function (b) {
      var on = b.getAttribute('data-key') === self.key;
      b.setAttribute('aria-checked', String(on));
      b.setAttribute('tabindex', on || (o.ref && b === self.nodes[self.nodes.length - 1]) ? '0' : '-1');
      b.classList.toggle('is-current', on);
    });
    this.refBtn.setAttribute('aria-pressed', String(!!o.ref));
    this.refBtn.classList.toggle('is-on', !!o.ref);
    var last = this.cfg.versions.length - 1;
    this.el.classList.toggle('is-ref', !!o.ref);
    this.nowV.textContent = o.ref ? '生成原曲' : o.label + (o.idx === last ? '・最新版' : '');
    if (this.reader) this.reader.setVersion(o.ref ? Number(this.lastKey.slice(1)) : o.idx);
    if (o.ref) {
      this.read.innerHTML = '';
      this.read.appendChild(el('b', 'r-id', '原曲'));
      this.read.appendChild(el('span', 'r-t', '生成的原曲，只作對照，不是作品。'));
    } else {
      this.showText(o.idx);
    }
    this.wave.innerHTML = '';
    var m = this.meta();
    if (m && m.peaks) {
      this.wave.appendChild(buildWave(m.peaks, 'w-base'));
      this.wave.appendChild(buildWave(m.peaks, 'w-played'));
    } else {
      this.wave.appendChild(el('span', 'wave-empty'));
    }
    this.wave.appendChild(el('span', 'wave-hover'));
    var d = this.duration();
    this.dur.textContent = d ? fmt(Math.round(d)) : '';
    this.wave.setAttribute('aria-valuemax', Math.round(d));
    this.progress();
  };
  Player.prototype.ensureAudio = function () {
    if (this.audio) return this.audio;
    var self = this;
    var a = new Audio();
    a.preload = 'none';
    a.src = src(this.opt().file);
    a.volume = this.gain();
    a.addEventListener('timeupdate', function () { self.progress(); });
    a.addEventListener('play', function () { self.setPlaying(true); });
    a.addEventListener('pause', function () { self.setPlaying(false); });
    a.addEventListener('ended', function () { self.setPlaying(false); });
    a.addEventListener('waiting', function () { self.setStatus('載入中'); });
    a.addEventListener('playing', function () { self.setStatus(''); });
    a.addEventListener('loadedmetadata', function () { self.dur.textContent = fmt(Math.round(a.duration)); });
    a.addEventListener('error', function () { self.setPlaying(false); self.setStatus('音檔載入失敗，請確認本機伺服器仍在執行', true); });
    this.audio = a;
    return a;
  };
  Player.prototype.setStatus = function (msg, isError) {
    this.status.textContent = msg;
    this.status.classList.toggle('is-error', !!isError);
  };
  Player.prototype.progress = function () {
    var t = this.audio ? this.audio.currentTime : 0;
    var d = this.duration() || 1;
    this.wave.style.setProperty('--p', Math.min(100, (t / d) * 100) + '%');
    this.cur.textContent = fmt(t);
    this.wave.setAttribute('aria-valuenow', Math.round(t));
    this.wave.setAttribute('aria-valuetext', fmt(t) + ' / ' + fmt(d));
  };
  Player.prototype.setPlaying = function (on) {
    this.el.classList.toggle('is-started', on || (this.audio && this.audio.currentTime > 0));
    this.playBtn.classList.toggle('is-playing', on);
    this.playBtn.setAttribute('aria-label', (on ? '暫停：' : '播放：') + this.title + ' ' + this.label());
    if (on) playing = this;
  };
  Player.prototype.play = function () {
    var self = this;
    Object.keys(players).forEach(function (k) { if (players[k] !== self) players[k].pause(); });
    var pr = this.ensureAudio().play();
    if (pr && pr.catch) pr.catch(function (err) {
      if (err && err.name !== 'AbortError') self.setStatus('無法播放：' + err.name, true);
    });
  };
  Player.prototype.pause = function () { if (this.audio && !this.audio.paused) this.audio.pause(); };
  Player.prototype.toggle = function () { if (this.audio && !this.audio.paused) this.pause(); else this.play(); };
  Player.prototype.seekTo = function (t) {
    var a = this.ensureAudio();
    var d = this.duration();
    t = Math.max(0, Math.min(t, Math.max(0, d - 0.25)));
    var apply = function () { try { a.currentTime = t; } catch (err) { /* 尚未載入 */ } };
    if (a.readyState >= 1) apply(); else { a.addEventListener('loadedmetadata', apply, { once: true }); a.load(); }
    this.el.classList.add('is-started');
    this.wave.style.setProperty('--p', (t / (d || 1)) * 100 + '%');
    this.cur.textContent = fmt(t);
  };
  // 切換版本：從同一秒接著播
  Player.prototype.select = function (key) {
    if (key === this.key) return;
    var self = this;
    var wasPlaying = this.audio && !this.audio.paused;
    var t = this.audio ? this.audio.currentTime : 0;
    this.key = key;
    if (key !== 'ref') this.lastKey = key;
    this.render();
    if (this.audio) {
      var a = this.audio;
      a.pause();
      a.src = src(this.opt().file);
      a.volume = this.gain();
      a.addEventListener('loadedmetadata', function () {
        try { a.currentTime = Math.min(t, Math.max(0, a.duration - 0.5)); } catch (err) { /* 略過 */ }
        self.progress();
        if (wasPlaying) self.play();
      }, { once: true });
      a.load();
    }
    this.playBtn.setAttribute('aria-label', '播放：' + this.title + ' ' + this.label());
  };

  $$('.work[data-song]').forEach(function (card) { players[card.getAttribute('data-song')] = new Player(card); });

  /* ===== 總譜閱讀器：跟著版本數線換總譜；左右翻頁（按鈕、滑動、鍵盤），點頁面放大 ===== */
  var lb = $('#lb'), lbImg = $('.lb-img', lb), lbCount = $('.lb-count', lb), lbScroll = $('.lb-scroll', lb);
  var lbReader = null, lbReturn = null;
  function pageSrc(prefix, n) { return 'scores/pages/' + prefix + '_p' + (n < 10 ? '0' : '') + n + '.webp'; }

  function Reader(box, song, title, badge) {
    var self = this;
    this.box = box;
    this.title = title;
    this.badge = badge;
    this.cfg = TRACKS[song] || {};
    this.scores = this.cfg.scores || {};
    this.versions = this.cfg.versions || [];
    this.key = null;
    this.label = '';
    this.page = 0;

    // 哪一版的總譜標在收合列右側（badge），這裡只放 PDF 連結
    var top = el('div', 'rd-top');
    this.pdf = el('a', 'rd-pdf', 'PDF 原檔');
    this.pdf.target = '_blank';
    this.pdf.rel = 'noopener';
    top.appendChild(this.pdf);

    var stage = el('div', 'rd-stage');
    this.track = el('div', 'rd-track');
    this.track.setAttribute('tabindex', '0');
    this.track.setAttribute('aria-roledescription', '翻頁閱讀器');
    stage.appendChild(this.track);

    var nav = el('div', 'rd-nav');
    this.prev = el('button', 'rd-btn ix');
    this.prev.type = 'button';
    this.prev.setAttribute('aria-label', '上一頁');
    this.prev.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
    this.next = el('button', 'rd-btn ix');
    this.next.type = 'button';
    this.next.setAttribute('aria-label', '下一頁');
    this.next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
    this.count = el('span', 'rd-count');
    this.count.setAttribute('aria-live', 'polite');
    var zoom = el('button', 'rd-zoom ix', '放大閱讀');
    zoom.type = 'button';
    var mid = el('div', 'rd-mid');
    mid.appendChild(this.count); mid.appendChild(zoom);
    nav.appendChild(this.prev); nav.appendChild(mid); nav.appendChild(this.next);

    box.appendChild(top); box.appendChild(stage); box.appendChild(nav);

    this.prev.addEventListener('click', function () { self.go(self.page - self.per()); });
    this.next.addEventListener('click', function () { self.go(self.page + self.per()); });
    zoom.addEventListener('click', function () { openLb(self, zoom); });
    this.track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); self.go(self.page + self.per()); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); self.go(self.page - self.per()); }
      if (e.key === 'Enter') { e.preventDefault(); openLb(self, self.track); }
    });
    var st = 0;
    this.track.addEventListener('scroll', function () {
      clearTimeout(st);
      st = setTimeout(function () {
        var p = Math.round(self.track.scrollLeft / Math.max(1, self.pageW()));
        if (p !== self.page) { self.page = p; self.sync(); }
      }, 80);
    }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(function () { self.sync(); }).observe(this.track);
  }
  // 版本 i 的總譜：自己有就用自己的，沒有就沿用前面最近一版
  Reader.prototype.scoreFor = function (i) {
    for (var j = i; j >= 0; j--) {
      var k = this.versions[j] && this.versions[j].score;
      if (k && this.scores[k]) return { key: k, from: j };
    }
    return null;
  };
  Reader.prototype.setVersion = function (i) {
    var hit = this.scoreFor(i);
    if (!hit) return;
    var fromV = this.versions[hit.from].v;
    var txt = hit.from === i ? fromV + ' 總譜' : '沿用 ' + fromV + ' 總譜';
    if (this.badge) { this.badge.textContent = txt; this.badge.classList.toggle('is-inherit', hit.from !== i); }
    this.label = fromV + ' 總譜';
    if (hit.key !== this.key) { this.key = hit.key; this.build(); }
  };
  Reader.prototype.cur = function () { return this.scores[this.key]; };
  Reader.prototype.pageW = function () {
    var f = this.track.firstElementChild;
    var w = f ? f.getBoundingClientRect().width : 0;
    return w || this.track.clientWidth || 1;
  };
  Reader.prototype.per = function () { return Math.max(1, Math.round((this.track.clientWidth || 1) / this.pageW())); };
  Reader.prototype.build = function () {
    var self = this, s = this.cur();
    this.track.innerHTML = '';
    for (var i = 1; i <= s.pages; i++) {
      var f = el('figure', 'rd-page');
      var img = el('img');
      img.src = pageSrc(s.prefix, i);
      img.width = 1601; img.height = 2265;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = this.title + ' ' + this.label + ' 第 ' + i + ' 頁';
      img.draggable = false;
      f.appendChild(img);
      (function (n) { f.addEventListener('click', function () { self.page = n; openLb(self, f); }); })(i - 1);
      this.track.appendChild(f);
    }
    this.pdf.href = s.pdf;
    this.page = 0;
    this.track.scrollLeft = 0;
    this.sync();
  };
  Reader.prototype.go = function (p) {
    var n = this.cur().pages, per = this.per();
    p = Math.max(0, Math.min(n - per, p));
    this.page = p;
    this.track.scrollTo({ left: p * this.pageW(), behavior: reduce.matches ? 'auto' : 'smooth' });
    this.sync();
  };
  Reader.prototype.sync = function () {
    if (!this.key) return;
    var n = this.cur().pages, per = this.per();
    var a = this.page + 1, b = Math.min(n, this.page + per);
    this.count.textContent = (b > a ? a + '–' + b : a) + ' / ' + n;
    this.prev.disabled = this.page <= 0;
    this.next.disabled = this.page + per >= n;
    if (lbReader === this) lbShow();
  };

  function lbShow() {
    var r = lbReader, s = r.cur();
    lbImg.src = pageSrc(s.prefix, r.page + 1);
    lbImg.alt = r.title + ' ' + r.label + ' 第 ' + (r.page + 1) + ' 頁';
    lbCount.textContent = r.label + '・' + (r.page + 1) + ' / ' + s.pages;
    $('[data-lb="prev"]', lb).disabled = r.page <= 0;
    $('[data-lb="next"]', lb).disabled = r.page >= s.pages - 1;
    lbScroll.scrollTop = 0;
    lbImg.classList.remove('is-zoom');
  }
  // 點頁面切換 2 倍放大（手機看小字），放大後可上下左右捲動
  lbImg.addEventListener('click', function (e) {
    var r = lbImg.getBoundingClientRect();
    var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    var on = lbImg.classList.toggle('is-zoom');
    if (on) {
      lbScroll.scrollLeft = fx * lbImg.offsetWidth - lbScroll.clientWidth / 2;
      lbScroll.scrollTop = fy * lbImg.offsetHeight - lbScroll.clientHeight / 2;
    }
  });
  function openLb(r, from) {
    lbReader = r; lbReturn = from;
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    lbShow();
    $('[data-lb="close"]', lb).focus();
  }
  function closeLb() {
    lb.hidden = true;
    document.documentElement.style.overflow = '';
    var r = lbReader;
    lbReader = null;
    if (r) r.go(r.page);
    if (lbReturn && lbReturn.focus) lbReturn.focus();
  }
  lb.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lb]');
    if (!b) return;
    var k = b.getAttribute('data-lb');
    if (k === 'close') closeLb();
    if (k === 'prev' && lbReader) { lbReader.page = Math.max(0, lbReader.page - 1); lbReader.sync(); }
    if (k === 'next' && lbReader) { lbReader.page = Math.min(lbReader.cur().pages - 1, lbReader.page + 1); lbReader.sync(); }
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight' && lbReader) { lbReader.page = Math.min(lbReader.cur().pages - 1, lbReader.page + 1); lbReader.sync(); }
    if (e.key === 'ArrowLeft' && lbReader) { lbReader.page = Math.max(0, lbReader.page - 1); lbReader.sync(); }
  });

  $$('.work[data-song]').forEach(function (card) {
    var id = card.getAttribute('data-song'), p = players[id];
    var r = new Reader($('.reader', card), id, card.getAttribute('data-title'), $('.score-v', card));
    p.reader = r;
    var o = p.opt();
    r.setVersion(o.ref ? Number(p.lastKey.slice(1)) : o.idx);
    // 總譜收合時寬度是 0，展開後重新對齊頁碼
    $('.score-fold .fold-head', card).addEventListener('click', function () { setTimeout(function () { r.go(r.page); }, 520); });
  });

  /* 舊網址 /mirror、/srh、/system、/future 與 #錨點：直接捲到對應區塊，收合的區塊先展開 */
  var seg = location.pathname.split('/').filter(Boolean).pop() || '';
  var OLD = { mirror: 'mirror', srh: 'srh', system: 'system', future: 'future', changes: 'works', listen: 'works' };
  var target = OLD[seg] || location.hash.slice(1);
  if (target && document.getElementById(target)) {
    requestAnimationFrame(function () { goSection(target, false); navLock = null; markNav(); });
  }
})();

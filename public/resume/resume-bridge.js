/* Read-only adapter for the LumaReader Web runtime. No upload or document-write APIs. */
(() => {
  'use strict';
  const nativeFetch = window.fetch.bind(window);
  const base = new URL('/resume/', location.origin);
  const initialPath = document.body.dataset.resumeLanguage === 'en' ? 'resume.en.md' : 'resume.zh.md';
  const paths = ['resume.zh.md', 'resume.en.md'];
  const documents = new Map();
  const key = 'kainnne-resume-reader-preferences-v1';
  const defaults = { readerDefaultsVersion: 6, onboardingVersion: 5, language: document.body.dataset.resumeLanguage, languagePromptSeen: true, toolbarVisibility: { language: true, readingMode: true, source: true, media: true, textSize: true } };
  const loadPreferences = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(key) || '{}') }; } catch { return { ...defaults }; } };
  const documentUrl = (path) => new URL(path === 'resume.en.md' ? 'en.html' : './', base).href;
  const json = (value, status = 200) => new Response(JSON.stringify(value), {status, headers: {'Content-Type': 'application/json; charset=utf-8'}});
  const ready = Promise.all(paths.map(async (path) => {
    const response = await nativeFetch(new URL(path, base), {cache: 'no-cache'});
    if (!response.ok) throw new Error(`Unable to load ${path} (${response.status})`);
    const text = await response.text();
    documents.set(path, Object.freeze({path, name: path, extension: '.md', ext: '.md', size: new TextEncoder().encode(text).length, text, renderText: text, sourceType: 'project', base: base.href, kind: 'markdown', mime: 'text/markdown', binary: false, capabilities: {paged: true, source: true, media: true}}));
  })).then(() => ({ok: true})).catch((error) => ({error: error.message}));
  window.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input), location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith('/api/')) return nativeFetch(input, init);
    if ((init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase() !== 'GET') return json({error: 'Read only'}, 405);
    await ready;
    if (url.pathname === '/api/files') return json({root: 'Kaine Zhu', files: paths.map((path) => documents.get(path)).filter(Boolean), types: [{extension: '.md', ext: '.md', kind: 'markdown', mime: 'text/markdown', binary: false, capabilities: {paged: true, source: true, media: true}}]});
    if (url.pathname === '/api/file') {
      const doc = documents.get(url.searchParams.get('path'));
      return doc ? json(doc) : json({error: 'Document not found'}, 404);
    }
    return json({error: 'Read only'}, 403);
  };
  window.lumaWeb = Object.freeze({
    ready, initialPath, documentUrl,
    mediaUrl(value) { try { const url = new URL(value, base); return /^(https?:|data:|blob:)$/.test(url.protocol) ? url.href : ''; } catch { return ''; } },
    async createShareUrl({name}) { return {ok: true, canonical: true, url: documentUrl(name)}; },
  });
  window.lumaDesktop = Object.freeze({
    isDesktop: false, platform: 'web',
    getPreferences: async () => loadPreferences(),
    async setPreferences(patch) {
      const next = {...loadPreferences(), ...patch};
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* Reading works without preference storage. */ }
      return next;
    },
    onLibraryChanged: () => () => {},
    exportPdf: (options) => window.ResumePrint.export(options),
  });
})();

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const context = vm.createContext({});
vm.runInContext(await read('public/resume/vendor/lumareader/vendor/marked/marked.umd.js'), context);
const marked = new context.marked.Marked();
// Source is maintained in this repository; raw HTML is unnecessary for this résumé.
marked.use({ renderer: { html() { return ''; } } });
let template = await read('scripts/resume/template.html');
template = template.replace('<html lang="zh-Hant"', '<html lang="{{LANG}}"')
  .replace(/  <meta name="description"[\s\S]*?  <title>LumaReader Web<\/title>/, `  <meta name="description" content="{{DESCRIPTION}}" />
  <meta name="robots" content="noindex" />
  <link rel="canonical" href="https://kainnne.com/resume/{{SUFFIX}}" />
  <link rel="alternate" hreflang="zh-Hant" href="https://kainnne.com/resume/" />
  <link rel="alternate" hreflang="en" href="https://kainnne.com/resume/en.html" />
  <link rel="icon" type="image/webp" href="assets/lumareader.webp" />
  <title>{{TITLE}}</title>`)
  .replace("connect-src 'self' http: https:", "connect-src 'self'")
  .replace(/(href|src)="(vendor\/[^\"]+|styles.css[^\"]*|library-ui.css[^\"]*|reader-utils.js[^\"]*|adapters\/[^\"]+|library-search.js[^\"]*|pdf-tools.js[^\"]*|pdf-dialog.js[^\"]*|app.js[^\"]*|multiformat-ui.js[^\"]*)"/g, '$1="vendor/lumareader/$2"')
  .replace('src="web-bridge.js?v=1.3.1"', 'src="resume-bridge.js?v=3"')
  .replaceAll('src="assets/app-icon-192.webp"', 'src="assets/lumareader.webp"')
  .replace('</head>', '  <link rel="stylesheet" href="resume.css?v=4" />\n</head>')
  .replace('<body class="booting">', '<body class="booting resume-reader resume-minimal-toolbar" data-resume-language="{{LANG}}">')
  .replace('Loading the example document…', 'Loading résumé Markdown…')
  .replace('<div class="library-controls">', `<nav class="resume-languages" aria-label="履歷語言 / Résumé language"><a href="./" lang="zh-Hant" {{ZH_CURRENT}}>中文履歷</a><a href="en.html" lang="en" {{EN_CURRENT}}>English</a></nav>
      <div class="library-controls" hidden inert>`)
  .replace('<script src="vendor/lumareader/vendor/marked/marked.umd.js', '<script src="resume-boot.js?v=1"></script>\n  <script src="vendor/lumareader/vendor/marked/marked.umd.js')
  .replace('<textarea id="source-editor"', '<textarea readonly disabled id="source-editor"')
  .replace(/<article id="content"[\s\S]*?<\/article>/, '<article id="content" class="content prose" lang="{{LANG}}">{{CONTENT}}</article>')
  .replace('<script src="resume-bridge.js?v=3"></script>', '<script src="resume-bridge.js?v=3"></script>\n  <script src="resume-print.js?v=1"></script>')
  .replace('app.js?v=1.3.1', 'app.js?v=resume-4')
  .replace(/^[ \t]*<label><span data-i18n="(?:source|media)">[^\n]*?<\/label>\n/gm, '')
  .replace(/(data-toolbar-visibility="[^"]+") checked/g, '$1')
  .replace('<button id="toolbar-reset"', '<label><span data-i18n="exportPdf">Export PDF</span><input type="checkbox" data-toolbar-visibility="exportPdf" /></label>\n                <button id="toolbar-reset"')
  .replaceAll('href="../#download"', 'href="https://lumareader.kainnne.com/#download"')
  .replace('<details><summary>Markdown → PDF</summary>', '<details hidden><summary>Markdown → PDF</summary>')
  .replace('</body>', '<noscript><style>body.booting{overflow:auto}body.booting #app{visibility:visible;pointer-events:auto}.boot-loader,.reader-actions,.sidebar-tools,.format-filter,.sidebar-tabs,#sidebar-toggle{display:none!important}</style></noscript>\n</body>');
const inertIds = ['edit-document','cancel-edit','editor-preview-control','editor-insert-control','new-markdown-dialog','discard-edit-dialog','session-dialog','drop-overlay','onboarding','source-view','media-view','share-document','share-dialog'];
for (const id of inertIds) template = template.replace(new RegExp(`(<[a-z]+ id="${id}"[^>]*)(>)`), '$1 inert$2');
for (const id of ['reading-mode-control','font-down','font-up','export-pdf']) template = template.replace(`id="${id}"`, `id="${id}" data-user-hidden="true"`);
template = template.replace('class="toolbar-dropdown language-control"', 'class="toolbar-dropdown language-control" data-user-hidden="true"');
for (const [code, lang, file, title, description] of [
  ['zh', 'zh-Hant', 'index.html', '朱璽 Kaine Zhu — 履歷', 'AI 工程師／數位教學工程師，AI 應用開發、產品設計與教育科技。'],
  ['en', 'en', 'en.html', 'Kaine Zhu — Résumé', 'AI Engineer / Digital Learning Engineer. AI applications, product development and EdTech.'],
]) {
  const markdown = await read(`public/resume/resume.${code}.md`);
  if (/\]\(\s*(?:javascript|data|vbscript):/i.test(markdown)) throw new Error('Unsupported résumé link scheme');
  const replacements = { LANG: lang, TITLE: escape(title), DESCRIPTION: escape(description), SUFFIX: code === 'zh' ? '' : file, ZH_CURRENT: code === 'zh' ? 'aria-current="page"' : '', EN_CURRENT: code === 'en' ? 'aria-current="page"' : '', CONTENT: marked.parse(markdown) };
  const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => replacements[key]);
  const path = new URL(`public/resume/${file}`, root);
  if (process.argv.includes('--check')) {
    if (await readFile(path, 'utf8') !== html) throw new Error(`Out of date: ${fileURLToPath(path)}`);
  } else await writeFile(path, html);
}
console.log(process.argv.includes('--check') ? 'Résumé pages match Markdown sources.' : 'Generated bilingual résumé pages.');

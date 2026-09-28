import { mkdir, readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

// Reuse the generated, résumé-adapted LumaReader shell and its exact runtime.
// V1 remains the shell source; only V2 content, metadata and document routing differ.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const check = process.argv.includes('--check');
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const context = vm.createContext({});
vm.runInContext(await read('public/resume/vendor/lumareader/vendor/marked/marked.umd.js'), context);
const marked = new context.marked.Marked();
marked.use({ renderer: { html() { return ''; } } });

function replaceOnce(source, pattern, replacement, label) {
  const matches = source.match(new RegExp(pattern.source, 'g'));
  if (matches?.length !== 1) throw new Error(`Expected one ${label}; found ${matches?.length || 0}`);
  return source.replace(pattern, () => replacement);
}

async function output(file, content) {
  const path = new URL(`public/resume-v2/${file}`, root);
  if (check) {
    if (await readFile(path, 'utf8') !== content) throw new Error(`Out of date: resume-v2/${file}`);
  } else {
    await mkdir(new URL('public/resume-v2/', root), { recursive: true });
    await writeFile(path, content);
  }
}

for (const [code, file, title, description] of [
  ['zh', 'index.html', '朱璽 Kaine Zhu — 履歷 V2 工作稿', 'AI 導入、Agent 產品開發與 LumaReader 開源作品。含教學構想、未來目標與編輯建議的履歷工作稿。'],
  ['en', 'en.html', 'Kaine Zhu — Résumé V2 Working Draft', 'AI adoption, agent product development and the open-source LumaReader. Working draft with proposed training, future goals and editorial feedback.'],
]) {
  const markdown = await read(`public/resume-v2/resume.${code}.md`);
  if (/\]\(\s*(?:javascript|data|vbscript):/i.test(markdown)) throw new Error('Unsupported résumé link scheme');
  let html = await read(`public/resume/${file}`);
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`, 'title');
  html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(description)}" />`, 'description');
  html = html.replaceAll('https://kainnne.com/resume/', 'https://kainnne.com/resume-v2/');
  // Shared CSS, scripts and images remain under /resume/, with no runtime fork.
  html = html.replace(/(href|src)="((?:vendor\/|assets\/|resume\.(?:css)|resume-(?:boot|print)\.js)[^"]*)"/g, '$1="/resume/$2"');
  html = html.replace('</head>', '  <link rel="stylesheet" href="resume-v2.css?v=1" />\n</head>');
  const lang = code === 'zh' ? 'zh-Hant' : 'en';
  html = replaceOnce(html, /<article id="content"[\s\S]*?<\/article>/, `<article id="content" class="content prose" lang="${lang}">${marked.parse(markdown)}</article>`, 'static content');
  await output(file, html);
}

// Derive the read-only adapter from V1 to retain all existing restrictions.
let bridge = await read('public/resume/resume-bridge.js');
bridge = replaceOnce(bridge, /new URL\('\/resume\/', location\.origin\)/, "new URL('/resume-v2/', location.origin)", 'document root');
bridge = replaceOnce(bridge, /'kainnne-resume-reader-preferences-v1'/, "'kainnne-resume-v2-reader-preferences-v1'", 'reader preference key');
await output('resume-bridge.js', bridge);
console.log(check ? 'Résumé V2 matches Markdown and the shared LumaReader shell.' : 'Generated bilingual résumé V2 with the shared LumaReader runtime.');

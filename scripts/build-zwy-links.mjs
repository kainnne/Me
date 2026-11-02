#!/usr/bin/env node
// Generates static redirect pages for the ZWY Tech business-card QR codes.
// The printed QR codes point at https://kainnne.com/z/<slug>/ forever; only zwy-links.json changes.
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { links } = JSON.parse(await readFile(resolve(root, "zwy-links.json"), "utf8"));
const outDir = resolve(root, "public/z");
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

await rm(outDir, { recursive: true, force: true });
for (const [slug, { name, target }] of Object.entries(links)) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  const url = new URL(target).href;
  const html = `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8">
<title>哲威揚科技 ZWY Tech — ${esc(name)}</title>
<meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0; url=${esc(url)}">
<link rel="canonical" href="${esc(url)}">
<script>location.replace(${JSON.stringify(url)});</script>
</head><body style="font-family:system-ui,sans-serif;padding:2rem">
<p>正在前往 <a href="${esc(url)}">${esc(url)}</a></p>
</body></html>
`;
  await mkdir(resolve(outDir, slug), { recursive: true });
  await writeFile(resolve(outDir, slug, "index.html"), html);
  console.log(`z/${slug}/ -> ${url}`);
}

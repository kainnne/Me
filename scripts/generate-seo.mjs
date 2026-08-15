#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const metadata = await readJson("src/siteMetadata.json");
const projects = await readJson("src/projects.json");
const checkOnly = process.argv.includes("--check");

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const absolute = (pathname) => new URL(pathname, metadata.siteUrl).href;
const imageUrl = absolute(metadata.brandMark.path);
const publicProjects = projects.filter((project) => project.status === "live" && project.href);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageObject",
      "@id": `${metadata.siteUrl}#brand-image`,
      url: imageUrl,
      contentUrl: imageUrl,
      width: metadata.brandMark.width,
      height: metadata.brandMark.height,
      caption: metadata.brandMark.alt,
    },
    {
      "@type": "Brand",
      "@id": `${metadata.siteUrl}#brand`,
      name: metadata.siteName,
      url: metadata.siteUrl,
      logo: { "@id": `${metadata.siteUrl}#brand-image` },
    },
    {
      "@type": "WebSite",
      "@id": `${metadata.siteUrl}#website`,
      url: metadata.siteUrl,
      name: metadata.siteName,
      description: metadata.description,
      inLanguage: metadata.languages,
      image: { "@id": `${metadata.siteUrl}#brand-image` },
      about: { "@id": `${metadata.siteUrl}#${metadata.person.id}` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${metadata.siteUrl}#profile`,
      url: metadata.siteUrl,
      name: `${metadata.siteName} — ${metadata.person.name}（朱璽）`,
      isPartOf: { "@id": `${metadata.siteUrl}#website` },
      mainEntity: { "@id": `${metadata.siteUrl}#${metadata.person.id}` },
      about: { "@id": `${metadata.siteUrl}#${metadata.person.id}` },
      image: { "@id": `${metadata.siteUrl}#brand-image` },
    },
    {
      "@type": "Person",
      "@id": `${metadata.siteUrl}#${metadata.person.id}`,
      name: metadata.person.name,
      alternateName: metadata.person.alternateName,
      url: metadata.siteUrl,
      jobTitle: metadata.person.jobTitle,
      knowsAbout: metadata.person.knowsAbout,
      sameAs: metadata.person.sameAs,
      brand: { "@id": `${metadata.siteUrl}#brand` },
    },
    {
      "@type": "ItemList",
      "@id": `${metadata.siteUrl}#projects`,
      name: `${metadata.siteName} projects`,
      itemListElement: publicProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: new URL(project.href).href,
      })),
    },
  ],
};

const head = [
  `<meta name="theme-color" content="${escapeHtml(metadata.themeColor)}" />`,
  '<meta name="author" content="Kaine Zhu（朱璽）" />',
  '<meta name="robots" content="index, follow, max-image-preview:large" />',
  `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
  `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
  `<meta property="og:description" content="${escapeHtml(metadata.openGraphDescription)}" />`,
  '<meta property="og:type" content="website" />',
  `<meta property="og:url" content="${escapeHtml(metadata.siteUrl)}" />`,
  `<meta property="og:site_name" content="${escapeHtml(metadata.siteName)}" />`,
  `<meta property="og:locale" content="${escapeHtml(metadata.locale)}" />`,
  `<meta property="og:locale:alternate" content="${escapeHtml(metadata.alternateLocale)}" />`,
  `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
  `<meta property="og:image:width" content="${metadata.brandMark.width}" />`,
  `<meta property="og:image:height" content="${metadata.brandMark.height}" />`,
  `<meta property="og:image:alt" content="${escapeHtml(metadata.brandMark.alt)}" />`,
  '<meta name="twitter:card" content="summary" />',
  `<meta name="twitter:title" content="${escapeHtml(metadata.siteName)}（Kaine Zhu／朱璽）" />`,
  `<meta name="twitter:description" content="${escapeHtml(metadata.shortDescription)}" />`,
  `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
  `<meta name="twitter:image:alt" content="${escapeHtml(metadata.brandMark.alt)}" />`,
  `<link rel="canonical" href="${escapeHtml(metadata.siteUrl)}" />`,
  '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />',
  '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
  '<link rel="manifest" href="/site.webmanifest" />',
  `<title>${escapeHtml(metadata.title)}</title>`,
].map((line) => `    ${line}`).join("\n");

const jsonLdBlock = [
  '    <script type="application/ld+json">',
  JSON.stringify(jsonLd, null, 2).replaceAll("<", "\\u003c").split("\n").map((line) => `      ${line}`).join("\n"),
  "    </script>",
].join("\n");

const replaceBlock = (source, name, content) => {
  const start = `    <!-- GEO:${name}:START -->`;
  const end = `    <!-- GEO:${name}:END -->`;
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`);
  if (!pattern.test(source)) throw new Error(`Missing ${name} generation markers in index.html`);
  return source.replace(pattern, `${start}\n${content}\n${end}`);
};

const indexPath = resolve(root, "index.html");
let expectedIndex = await readFile(indexPath, "utf8");
expectedIndex = replaceBlock(expectedIndex, "HEAD", head);
expectedIndex = replaceBlock(expectedIndex, "JSONLD", jsonLdBlock);

const expectedFiles = new Map([
  [indexPath, expectedIndex],
  [resolve(root, "public/robots.txt"), `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${absolute("/sitemap.xml")}\n`],
  [resolve(root, "public/sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${metadata.siteUrl}</loc>\n    <lastmod>${metadata.contentLastModified}</lastmod>\n  </url>\n</urlset>\n`],
  [resolve(root, "public/site.webmanifest"), `${JSON.stringify({
    name: metadata.siteName,
    short_name: metadata.siteName,
    description: metadata.description,
    start_url: "/",
    display: "standalone",
    background_color: metadata.themeColor,
    theme_color: metadata.themeColor,
    icons: [
      { src: "/brand/kainnne-mark-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/kainnne-mark-512.png", sizes: "512x512", type: "image/png" },
    ],
  }, null, 2)}\n`],
]);

const drift = [];
for (const [path, expected] of expectedFiles) {
  let current = "";
  try { current = await readFile(path, "utf8"); } catch {}
  if (current === expected) continue;
  if (checkOnly) drift.push(path.replace(`${root}/`, ""));
  else await writeFile(path, expected, "utf8");
}

if (checkOnly && drift.length > 0) {
  process.stderr.write(`SEO artifacts are out of date: ${drift.join(", ")}\nRun npm run seo:generate.\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(checkOnly ? "SEO artifacts are current.\n" : "SEO artifacts generated.\n");
}

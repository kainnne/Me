import type { SiteLanguage } from "./projects";

export function assistantUrl(language: SiteLanguage) {
  const url = new URL("https://wikinb.kainnne.com/gemini/");
  url.searchParams.set("lang", language === "en" ? "en" : "zh-TW");
  return url.href;
}

export function initialLanguage(search: string, saved: string | null): SiteLanguage {
  const requested = new URLSearchParams(search).get("lang");
  if (requested === "en") return "en";
  if (requested === "zh" || requested === "zh-TW") return "zh";
  return saved === "en" ? "en" : "zh";
}
